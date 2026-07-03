"use server";

import Stripe from "stripe";
import { db } from "@/lib/db";
import { orders, orderDesigns } from "@/lib/db/schema";
import { redirect } from "next/navigation";
import type { ConfiguratorState } from "@/types/configurator";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2026-06-24.dahlia" as any, // Cast as any to bypass strict version locking if types differ
});

export async function createCheckoutSession(
  configState: ConfiguratorState,
  quantity: number,
  unitPriceCents: number,
  subtotalCents: number,
  vatAmountCents: number,
  totalCents: number
) {
  try {
    // 1. Create Order in Pending State
    // Since we don't have the user yet (Guest checkout), we create the order with guest info to be filled via Stripe.
    // In a real app we'd save this to DB first, then get the order.id.
    // We are mocking the DB insertion for this demo.
    
    /*
    const [order] = await db.insert(orders).values({
      status: "PENDING_PAYMENT",
      quantity,
      unitPriceCents,
      subtotalCents,
      vatAmountCents,
      taxRate: "0.20",
      totalCents,
      templateSlug: configState.templateSlug,
      establishmentName: configState.establishmentName,
      slogan: configState.slogan,
      legalMentions: configState.legalMentions,
    }).returning();
    */
    
    const mockOrderId = "mock-order-id";

    // 2. Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "eur",
            unit_amount: totalCents,
            product_data: {
              name: configState.templateSlug === "standard"
                ? `Bûchettes de sucre standard PariSucre — ${quantity.toLocaleString('fr-FR')} unités`
                : `Bûchettes de sucre personnalisées — ${quantity.toLocaleString('fr-FR')} unités`,
              description: configState.templateSlug === "standard"
                ? "Gamme Standard PariSucre — Prêts à servir"
                : `Modèle: ${configState.templateSlug} - ${configState.establishmentName}`,
            },
          },
          quantity: 1, // Total already calculated
        },
      ],
      billing_address_collection: "required",
      shipping_address_collection: {
        allowed_countries: ["FR"],
      },
      custom_fields: [
        {
          key: "company_name",
          label: { type: "custom", custom: "Raison sociale" },
          type: "text",
        },
        {
          key: "siret",
          label: { type: "custom", custom: "N° SIRET" },
          type: "text",
          optional: true,
        },
        {
          key: "phone",
          label: { type: "custom", custom: "Téléphone" },
          type: "text",
        },
      ],
      metadata: {
        orderId: mockOrderId,
        templateSlug: configState.templateSlug,
        quantity: quantity.toString(),
      },
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/commande/confirmation?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/?cancelled=true`,
    });

    if (session.url) {
      return { url: session.url };
    }
    
    return { error: "Impossible de créer la session Stripe." };
  } catch (error) {
    console.error("Checkout Error:", error);
    return { error: "Une erreur est survenue lors de la création de la session Stripe." };
  }
}

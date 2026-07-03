import { headers } from "next/headers";
import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { db } from "@/lib/db";
import { orders } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { getStripe } from "@/lib/stripe/client";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!webhookSecret) {
      console.error("Missing STRIPE_WEBHOOK_SECRET environment variable");
      return new NextResponse("Internal Server Error", { status: 500 });
    }

    const body = await req.text();
    const signature = (await headers()).get("Stripe-Signature") as string;

    let event: Stripe.Event;

    try {
      event = getStripe().webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err: any) {
      console.error(`Webhook signature verification failed: ${err.message}`);
      return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
    }

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      
      const orderId = session.metadata?.orderId;
      
      if (orderId) {
        // Update order status
        // await db.update(orders).set({ status: "PAID" }).where(eq(orders.id, orderId));
        
        console.log(`Payment successful for order: ${orderId}`);
        // Here we could trigger a Resend email to notify PariSucre and the customer.
      }
    }

    return new NextResponse(null, { status: 200 });
  } catch (err: any) {
    console.error("Webhook error:", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { db } from "@/lib/db";
import { orders } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2026-06-24.dahlia" as any,
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: Request) {
  try {
    const body = await req.text();
    const signature = (await headers()).get("Stripe-Signature") as string;

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
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

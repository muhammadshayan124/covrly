import { NextRequest, NextResponse } from "next/server";
import type Stripe from "stripe";
import { getStripeClient, isBillingConfigured } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  if (!isBillingConfigured() || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Billing is not configured" }, { status: 503 });
  }

  const signature = req.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing stripe-signature header" }, { status: 400 });
  }

  const rawBody = await req.text();
  const stripe = getStripeClient();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, process.env.STRIPE_WEBHOOK_SECRET);
  } catch {
    return NextResponse.json({ error: "Invalid webhook signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const checkoutSession = event.data.object as Stripe.Checkout.Session;
    const organizationId = checkoutSession.client_reference_id;
    if (organizationId) {
      await prisma.organization.update({
        where: { id: organizationId },
        data: {
          plan: "pro",
          stripeCustomerId:
            typeof checkoutSession.customer === "string" ? checkoutSession.customer : undefined,
          stripeSubscriptionId:
            typeof checkoutSession.subscription === "string"
              ? checkoutSession.subscription
              : undefined,
        },
      });
    }
  }

  if (event.type === "customer.subscription.deleted") {
    const subscription = event.data.object as Stripe.Subscription;
    await prisma.organization.updateMany({
      where: { stripeSubscriptionId: subscription.id },
      data: { plan: "trial" },
    });
  }

  return NextResponse.json({ received: true });
}

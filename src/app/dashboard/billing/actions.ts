"use server";

import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { getStripeClient, isBillingConfigured } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";

export async function startCheckoutAction(): Promise<void> {
  const session = await auth();
  if (!session?.user || !isBillingConfigured()) return;

  const org = await prisma.organization.findUniqueOrThrow({
    where: { id: session.user.organizationId },
  });

  const stripe = getStripeClient();
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  const checkoutSession = await stripe.checkout.sessions.create({
    mode: "subscription",
    line_items: [{ price: process.env.STRIPE_PRICE_ID!, quantity: 1 }],
    customer: org.stripeCustomerId ?? undefined,
    client_reference_id: org.id,
    success_url: `${appUrl}/dashboard/billing?checkout=success`,
    cancel_url: `${appUrl}/dashboard/billing?checkout=cancelled`,
  });

  if (!checkoutSession.url) {
    throw new Error("Stripe did not return a checkout URL");
  }
  redirect(checkoutSession.url);
}

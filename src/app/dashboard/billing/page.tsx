import { CreditCard } from "lucide-react";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { isBillingConfigured } from "@/lib/stripe";
import { startCheckoutAction } from "./actions";

export default async function BillingPage() {
  const session = await auth();
  const org = await prisma.organization.findUniqueOrThrow({
    where: { id: session!.user.organizationId },
  });

  const configured = isBillingConfigured();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold text-black dark:text-zinc-50">Billing</h1>
      </div>

      <div className="flex items-center gap-4 rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-100 text-violet-600 dark:bg-violet-500/10 dark:text-violet-400">
          <CreditCard className="h-5 w-5" />
        </div>
        <div>
          <p className="text-sm text-zinc-500">Current plan</p>
          <p className="font-semibold capitalize text-black dark:text-zinc-50">{org.plan}</p>
        </div>
      </div>

      {org.plan === "trial" &&
        (configured ? (
          <form action={startCheckoutAction}>
            <button
              type="submit"
              className="rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-500 px-5 py-2.5 font-medium text-white shadow-sm transition-transform hover:scale-105"
            >
              Upgrade to Pro
            </button>
          </form>
        ) : (
          <p className="rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-600 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400">
            Billing isn&apos;t connected yet — you&apos;re on an unlimited trial in the
            meantime. Add <code>STRIPE_SECRET_KEY</code>, <code>STRIPE_PRICE_ID</code>, and{" "}
            <code>STRIPE_WEBHOOK_SECRET</code> to enable upgrades.
          </p>
        ))}
    </div>
  );
}

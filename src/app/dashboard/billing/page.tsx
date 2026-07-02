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
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          Current plan:{" "}
          <span className="font-medium text-black dark:text-zinc-50">{org.plan}</span>
        </p>
      </div>

      {org.plan === "trial" &&
        (configured ? (
          <form action={startCheckoutAction}>
            <button
              type="submit"
              className="rounded-lg bg-black px-5 py-2 font-medium text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
            >
              Upgrade to Pro
            </button>
          </form>
        ) : (
          <p className="rounded-lg border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-600 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400">
            Billing isn&apos;t connected yet — you&apos;re on an unlimited trial in the
            meantime. Add <code>STRIPE_SECRET_KEY</code>, <code>STRIPE_PRICE_ID</code>, and{" "}
            <code>STRIPE_WEBHOOK_SECRET</code> to enable upgrades.
          </p>
        ))}
    </div>
  );
}

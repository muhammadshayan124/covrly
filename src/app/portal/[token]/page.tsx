import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { respondAction } from "./actions";

export default async function StaffPortalPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;

  const staff = await prisma.staffMember.findUnique({ where: { portalToken: token } });
  if (!staff) notFound();

  const [pendingOffers, upcomingShifts] = await Promise.all([
    prisma.coverageOffer.findMany({
      where: { staffMemberId: staff.id, status: "pending" },
      orderBy: { sentAt: "asc" },
      include: { coverageRequest: { include: { shift: true } } },
    }),
    prisma.shift.findMany({
      where: { assignedStaffId: staff.id, startsAt: { gte: new Date() } },
      orderBy: { startsAt: "asc" },
    }),
  ]);

  return (
    <div className="flex flex-1 flex-col items-center bg-zinc-50 px-6 py-16 dark:bg-black">
      <div className="w-full max-w-md">
        <h1 className="text-2xl font-semibold text-black dark:text-zinc-50">Hi {staff.name}</h1>

        <section className="mt-6">
          <h2 className="font-medium text-black dark:text-zinc-50">Coverage requests</h2>
          {pendingOffers.length === 0 ? (
            <p className="mt-2 text-sm text-zinc-500">Nothing pending right now.</p>
          ) : (
            <ul className="mt-2 flex flex-col gap-3">
              {pendingOffers.map((offer) => (
                <li
                  key={offer.id}
                  className="rounded-lg border border-amber-300 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-950"
                >
                  <p className="text-sm text-black dark:text-zinc-50">
                    {offer.coverageRequest.shift.role} shift —{" "}
                    {new Date(offer.coverageRequest.shift.startsAt).toLocaleString()}
                  </p>
                  <div className="mt-3 flex gap-2">
                    <form action={respondAction.bind(null, token, offer.id, "accept")}>
                      <button
                        type="submit"
                        className="rounded-lg bg-emerald-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-emerald-700"
                      >
                        I can cover it
                      </button>
                    </form>
                    <form action={respondAction.bind(null, token, offer.id, "decline")}>
                      <button
                        type="submit"
                        className="rounded-lg border border-zinc-300 px-4 py-1.5 text-sm font-medium hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800"
                      >
                        Can&apos;t make it
                      </button>
                    </form>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="mt-8">
          <h2 className="font-medium text-black dark:text-zinc-50">Your upcoming shifts</h2>
          {upcomingShifts.length === 0 ? (
            <p className="mt-2 text-sm text-zinc-500">Nothing scheduled.</p>
          ) : (
            <ul className="mt-2 flex flex-col gap-1 text-sm text-zinc-700 dark:text-zinc-300">
              {upcomingShifts.map((shift) => (
                <li key={shift.id}>
                  {shift.role} — {new Date(shift.startsAt).toLocaleString()}
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}

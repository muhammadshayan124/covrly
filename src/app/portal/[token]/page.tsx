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
    <div className="flex flex-1 flex-col items-center bg-zinc-50 px-6 py-12 dark:bg-black">
      <div className="w-full max-w-md">
        <div className="flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-md bg-gradient-to-br from-violet-500 to-orange-400 text-xs font-bold text-white">
            C
          </span>
          <span className="text-sm font-medium text-zinc-500">Covrly</span>
        </div>
        <h1 className="mt-4 text-2xl font-semibold text-black dark:text-zinc-50">
          Hi {staff.name}
        </h1>

        <section className="mt-6">
          <h2 className="font-medium text-black dark:text-zinc-50">Coverage requests</h2>
          {pendingOffers.length === 0 ? (
            <p className="mt-2 text-sm text-zinc-500">Nothing pending right now.</p>
          ) : (
            <ul className="mt-2 flex flex-col gap-3">
              {pendingOffers.map((offer) => (
                <li
                  key={offer.id}
                  className="rounded-2xl border border-amber-200 bg-amber-50 p-4 shadow-sm dark:border-amber-900 dark:bg-amber-950/50"
                >
                  <p className="text-sm text-black dark:text-zinc-50">
                    {offer.coverageRequest.shift.role} shift —{" "}
                    {new Date(offer.coverageRequest.shift.startsAt).toLocaleString()}
                  </p>
                  <div className="mt-3 flex gap-2">
                    <form action={respondAction.bind(null, token, offer.id, "accept")}>
                      <button
                        type="submit"
                        className="rounded-full bg-emerald-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-transform hover:scale-105"
                      >
                        I can cover it
                      </button>
                    </form>
                    <form action={respondAction.bind(null, token, offer.id, "decline")}>
                      <button
                        type="submit"
                        className="rounded-full border border-zinc-300 px-4 py-2 text-sm font-medium transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800"
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
            <ul className="mt-2 flex flex-col gap-2">
              {upcomingShifts.map((shift) => (
                <li
                  key={shift.id}
                  className="rounded-xl border border-zinc-200 bg-white px-3.5 py-2.5 text-sm text-zinc-700 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300"
                >
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

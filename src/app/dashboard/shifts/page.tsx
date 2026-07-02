import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import CreateShiftForm from "./CreateShiftForm";
import { requestCoverageAction } from "./actions";

const STATUS_STYLES: Record<string, string> = {
  scheduled: "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300",
  needs_coverage: "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300",
  covered: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300",
  uncovered: "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300",
};

export default async function ShiftsPage() {
  const session = await auth();
  const organizationId = session!.user.organizationId;

  const [shifts, staff] = await Promise.all([
    prisma.shift.findMany({
      where: { organizationId },
      orderBy: { startsAt: "asc" },
      include: {
        assignedStaff: true,
        coverageRequests: {
          orderBy: { createdAt: "desc" },
          take: 1,
          include: { offers: { include: { staffMember: true }, orderBy: { sequence: "asc" } } },
        },
      },
    }),
    prisma.staffMember.findMany({ where: { organizationId }, orderBy: { priority: "asc" } }),
  ]);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold text-black dark:text-zinc-50">Shifts</h1>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          Mark a shift as needing coverage and Covrly offers it to staff one at a time.
        </p>
      </div>

      <CreateShiftForm staff={staff} />

      {shifts.length === 0 ? (
        <p className="text-sm text-zinc-500">No shifts yet.</p>
      ) : (
        <ul className="flex flex-col gap-3">
          {shifts.map((shift) => {
            const activeRequest = shift.coverageRequests[0];
            return (
              <li
                key={shift.id}
                className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-black dark:text-zinc-50">
                      {shift.role} — {new Date(shift.startsAt).toLocaleString()}
                    </p>
                    <p className="text-sm text-zinc-500">
                      {shift.assignedStaff ? shift.assignedStaff.name : "Unassigned"}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className={`rounded-full px-2 py-1 text-xs font-medium ${STATUS_STYLES[shift.status] ?? ""}`}
                    >
                      {shift.status.replace("_", " ")}
                    </span>
                    {shift.status !== "needs_coverage" && shift.status !== "covered" && (
                      <form action={requestCoverageAction.bind(null, shift.id)}>
                        <button
                          type="submit"
                          className="rounded-lg border border-zinc-300 px-3 py-1 text-sm font-medium hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800"
                        >
                          Request coverage
                        </button>
                      </form>
                    )}
                  </div>
                </div>

                {activeRequest && activeRequest.offers.length > 0 && (
                  <ul className="mt-3 flex flex-col gap-1 border-t border-zinc-100 pt-3 text-sm dark:border-zinc-800">
                    {activeRequest.offers.map((offer) => (
                      <li key={offer.id} className="flex items-center justify-between">
                        <span className="text-zinc-700 dark:text-zinc-300">
                          {offer.staffMember.name}
                        </span>
                        <span
                          className={
                            offer.status === "accepted"
                              ? "text-emerald-600 dark:text-emerald-400"
                              : offer.status === "declined"
                                ? "text-red-500"
                                : offer.status === "expired"
                                  ? "text-zinc-400"
                                  : "text-amber-600 dark:text-amber-400"
                          }
                        >
                          {offer.status}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

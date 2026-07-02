import Link from "next/link";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export default async function DashboardPage() {
  const session = await auth();
  const organizationId = session!.user.organizationId;

  const [needsCoverage, upcomingShifts, recentMessages] = await Promise.all([
    prisma.shift.findMany({
      where: { organizationId, status: "needs_coverage" },
      orderBy: { startsAt: "asc" },
    }),
    prisma.shift.count({
      where: { organizationId, status: { in: ["scheduled", "covered"] }, startsAt: { gte: new Date() } },
    }),
    prisma.message.findMany({
      where: { organizationId },
      orderBy: { createdAt: "desc" },
      take: 10,
    }),
  ]);

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-semibold text-black dark:text-zinc-50">Dashboard</h1>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          {upcomingShifts} upcoming shift{upcomingShifts === 1 ? "" : "s"} scheduled.
        </p>
      </div>

      <section>
        <h2 className="font-medium text-black dark:text-zinc-50">Needs coverage</h2>
        {needsCoverage.length === 0 ? (
          <p className="mt-2 text-sm text-zinc-500">Nothing open right now.</p>
        ) : (
          <ul className="mt-2 flex flex-col gap-2">
            {needsCoverage.map((shift) => (
              <li
                key={shift.id}
                className="flex items-center justify-between rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 dark:border-amber-800 dark:bg-amber-950"
              >
                <span className="text-sm text-black dark:text-zinc-50">
                  {shift.role} — {new Date(shift.startsAt).toLocaleString()}
                </span>
                <Link
                  href="/dashboard/shifts"
                  className="text-sm font-medium text-amber-700 underline dark:text-amber-300"
                >
                  View
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h2 className="font-medium text-black dark:text-zinc-50">Recent activity</h2>
        {recentMessages.length === 0 ? (
          <p className="mt-2 text-sm text-zinc-500">No messages yet.</p>
        ) : (
          <ul className="mt-2 flex flex-col gap-2">
            {recentMessages.map((message) => (
              <li
                key={message.id}
                className="rounded-lg border border-zinc-200 bg-white px-4 py-2 text-sm dark:border-zinc-800 dark:bg-zinc-900"
              >
                <span
                  className={
                    message.direction === "outbound"
                      ? "text-zinc-500"
                      : "font-medium text-black dark:text-zinc-50"
                  }
                >
                  {message.direction === "outbound" ? "Sent" : "Received"}:
                </span>{" "}
                <span className="text-zinc-700 dark:text-zinc-300">{message.body}</span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

import { Activity, AlertTriangle, CalendarClock } from "lucide-react";
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
          Welcome back, {session!.user.name}.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex items-center gap-4 rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-100 text-violet-600 dark:bg-violet-500/10 dark:text-violet-400">
            <CalendarClock className="h-5 w-5" />
          </div>
          <div>
            <p className="text-2xl font-semibold text-black dark:text-zinc-50">{upcomingShifts}</p>
            <p className="text-sm text-zinc-500">Upcoming shifts</p>
          </div>
        </div>
        <div className="flex items-center gap-4 rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <div>
            <p className="text-2xl font-semibold text-black dark:text-zinc-50">
              {needsCoverage.length}
            </p>
            <p className="text-sm text-zinc-500">Need coverage</p>
          </div>
        </div>
      </div>

      <section>
        <h2 className="flex items-center gap-2 font-medium text-black dark:text-zinc-50">
          <AlertTriangle className="h-4 w-4 text-amber-500" />
          Needs coverage
        </h2>
        {needsCoverage.length === 0 ? (
          <p className="mt-2 text-sm text-zinc-500">Nothing open right now.</p>
        ) : (
          <ul className="mt-3 flex flex-col gap-2">
            {needsCoverage.map((shift) => (
              <li
                key={shift.id}
                className="flex items-center justify-between rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 dark:border-amber-900 dark:bg-amber-950/50"
              >
                <span className="text-sm text-black dark:text-zinc-50">
                  {shift.role} — {new Date(shift.startsAt).toLocaleString()}
                </span>
                <Link
                  href="/dashboard/shifts"
                  className="text-sm font-medium text-amber-700 underline decoration-amber-300 underline-offset-2 dark:text-amber-300"
                >
                  View
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h2 className="flex items-center gap-2 font-medium text-black dark:text-zinc-50">
          <Activity className="h-4 w-4 text-violet-500" />
          Recent activity
        </h2>
        {recentMessages.length === 0 ? (
          <p className="mt-2 text-sm text-zinc-500">No messages yet.</p>
        ) : (
          <ul className="mt-3 flex flex-col gap-2">
            {recentMessages.map((message) => (
              <li
                key={message.id}
                className="rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
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

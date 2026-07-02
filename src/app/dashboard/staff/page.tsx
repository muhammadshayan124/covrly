import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import AddStaffForm from "./AddStaffForm";
import { removeStaffAction } from "./actions";

export default async function StaffPage() {
  const session = await auth();
  const organizationId = session!.user.organizationId;

  const staff = await prisma.staffMember.findMany({
    where: { organizationId },
    orderBy: { priority: "asc" },
  });

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold text-black dark:text-zinc-50">Staff</h1>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          When a shift needs coverage, staff are offered it in priority order (lowest
          number first).
        </p>
      </div>

      <AddStaffForm />

      {staff.length === 0 ? (
        <p className="text-sm text-zinc-500">No staff added yet.</p>
      ) : (
        <ul className="flex flex-col gap-2">
          {staff.map((member) => (
            <li
              key={member.id}
              className="flex items-center justify-between rounded-xl border border-zinc-200 bg-white px-4 py-3 shadow-sm transition-colors hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-violet-100 to-orange-100 text-sm font-semibold text-violet-700 dark:from-violet-500/10 dark:to-orange-500/10 dark:text-violet-300">
                  {member.name.charAt(0).toUpperCase()}
                </span>
                <div>
                  <p className="font-medium text-black dark:text-zinc-50">{member.name}</p>
                  <p className="text-sm text-zinc-500">
                    {member.phone} · priority {member.priority}
                  </p>
                </div>
              </div>
              <form action={removeStaffAction.bind(null, member.id)}>
                <button
                  type="submit"
                  className="text-sm text-red-600 transition-colors hover:underline dark:text-red-400"
                >
                  Remove
                </button>
              </form>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

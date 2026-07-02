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
              className="flex items-center justify-between rounded-lg border border-zinc-200 bg-white px-4 py-3 dark:border-zinc-800 dark:bg-zinc-900"
            >
              <div>
                <p className="font-medium text-black dark:text-zinc-50">{member.name}</p>
                <p className="text-sm text-zinc-500">
                  {member.phone} · priority {member.priority}
                </p>
              </div>
              <form action={removeStaffAction.bind(null, member.id)}>
                <button
                  type="submit"
                  className="text-sm text-red-600 hover:underline dark:text-red-400"
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

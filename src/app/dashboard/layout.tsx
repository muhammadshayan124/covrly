import Link from "next/link";
import { redirect } from "next/navigation";
import { auth, signOut } from "@/auth";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  return (
    <div className="flex min-h-full flex-1 flex-col bg-zinc-50 dark:bg-black">
      <header className="sticky top-0 z-10 flex items-center justify-between border-b border-zinc-200 bg-zinc-50/80 px-6 py-4 backdrop-blur-md dark:border-zinc-800 dark:bg-black/70">
        <nav className="flex items-center gap-6">
          <Link href="/dashboard" className="flex items-center gap-2 font-semibold text-black dark:text-zinc-50">
            <span className="flex h-6 w-6 items-center justify-center rounded-md bg-gradient-to-br from-violet-500 to-orange-400 text-xs font-bold text-white">
              C
            </span>
            Covrly
          </Link>
          <Link
            href="/dashboard/staff"
            className="text-sm text-zinc-600 transition-colors hover:text-black dark:text-zinc-400 dark:hover:text-white"
          >
            Staff
          </Link>
          <Link
            href="/dashboard/shifts"
            className="text-sm text-zinc-600 transition-colors hover:text-black dark:text-zinc-400 dark:hover:text-white"
          >
            Shifts
          </Link>
          <Link
            href="/dashboard/billing"
            className="text-sm text-zinc-600 transition-colors hover:text-black dark:text-zinc-400 dark:hover:text-white"
          >
            Billing
          </Link>
        </nav>
        <form
          action={async () => {
            "use server";
            await signOut({ redirectTo: "/" });
          }}
        >
          <button
            type="submit"
            className="text-sm text-zinc-600 transition-colors hover:text-black dark:text-zinc-400 dark:hover:text-white"
          >
            Log out
          </button>
        </form>
      </header>
      <main className="mx-auto w-full max-w-4xl flex-1 px-6 py-8">{children}</main>
    </div>
  );
}

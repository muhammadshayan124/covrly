import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col items-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex w-full max-w-2xl flex-1 flex-col items-center justify-center px-6 py-24 text-center">
        <h1 className="text-4xl font-semibold tracking-tight text-black dark:text-zinc-50">
          Covrly
        </h1>
        <p className="mt-4 max-w-md text-lg text-zinc-600 dark:text-zinc-400">
          When someone calls out, Covrly texts your staff in priority order — automatically
          — until the shift is covered. No more group chats, no more scrambling.
        </p>

        <div className="mt-8 flex gap-3">
          <Link
            href="/signup"
            className="rounded-lg bg-black px-6 py-3 font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
          >
            Start free trial
          </Link>
          <Link
            href="/login"
            className="rounded-lg border border-zinc-300 px-6 py-3 font-medium text-black transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:text-white dark:hover:bg-zinc-900"
          >
            Log in
          </Link>
        </div>

        <div className="mt-16 grid gap-6 text-left sm:grid-cols-3">
          <div>
            <h2 className="font-medium text-black dark:text-zinc-50">1. Someone calls out</h2>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
              Mark a shift as needing coverage from your dashboard.
            </p>
          </div>
          <div>
            <h2 className="font-medium text-black dark:text-zinc-50">2. We text your staff</h2>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
              In priority order, one at a time, until someone says yes.
            </p>
          </div>
          <div>
            <h2 className="font-medium text-black dark:text-zinc-50">3. Shift covered</h2>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
              You get notified the moment it&apos;s filled — no manual follow-up.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

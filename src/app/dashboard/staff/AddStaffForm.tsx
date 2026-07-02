"use client";

import { useActionState } from "react";
import { addStaffAction, type StaffFormState } from "./actions";

const initialState: StaffFormState = {};

export default function AddStaffForm() {
  const [state, formAction, pending] = useActionState(addStaffAction, initialState);

  return (
    <form action={formAction} className="flex flex-wrap items-end gap-2">
      <div className="flex flex-col">
        <label className="text-xs text-zinc-500">Name</label>
        <input
          name="name"
          required
          className="rounded-lg border border-zinc-300 bg-white px-3 py-1.5 text-sm text-black outline-none focus:border-zinc-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white"
        />
      </div>
      <div className="flex flex-col">
        <label className="text-xs text-zinc-500">Phone</label>
        <input
          name="phone"
          required
          placeholder="+15551234567"
          className="rounded-lg border border-zinc-300 bg-white px-3 py-1.5 text-sm text-black outline-none focus:border-zinc-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white"
        />
      </div>
      <div className="flex flex-col">
        <label className="text-xs text-zinc-500">Priority (lower = called first)</label>
        <input
          name="priority"
          type="number"
          defaultValue={0}
          min={0}
          className="w-40 rounded-lg border border-zinc-300 bg-white px-3 py-1.5 text-sm text-black outline-none focus:border-zinc-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white"
        />
      </div>
      <button
        type="submit"
        disabled={pending}
        className="rounded-lg bg-black px-4 py-1.5 text-sm font-medium text-white hover:bg-zinc-800 disabled:opacity-50 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
      >
        {pending ? "Adding…" : "Add staff"}
      </button>
      {state.error && <p className="w-full text-sm text-red-600 dark:text-red-400">{state.error}</p>}
    </form>
  );
}

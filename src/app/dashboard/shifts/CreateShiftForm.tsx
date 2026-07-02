"use client";

import { useActionState } from "react";
import { createShiftAction, type ShiftFormState } from "./actions";

const initialState: ShiftFormState = {};

interface StaffOption {
  id: string;
  name: string;
}

export default function CreateShiftForm({ staff }: { staff: StaffOption[] }) {
  const [state, formAction, pending] = useActionState(createShiftAction, initialState);

  return (
    <form action={formAction} className="flex flex-wrap items-end gap-2 rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex flex-col">
        <label className="text-xs text-zinc-500">Role</label>
        <input
          name="role"
          required
          placeholder="Server"
          className="rounded-lg border border-zinc-300 bg-white px-3 py-1.5 text-sm text-black outline-none transition-colors focus:border-violet-400 dark:border-zinc-700 dark:bg-zinc-950 dark:text-white"
        />
      </div>
      <div className="flex flex-col">
        <label className="text-xs text-zinc-500">Starts</label>
        <input
          name="startsAt"
          type="datetime-local"
          required
          className="rounded-lg border border-zinc-300 bg-white px-3 py-1.5 text-sm text-black outline-none transition-colors focus:border-violet-400 dark:border-zinc-700 dark:bg-zinc-950 dark:text-white"
        />
      </div>
      <div className="flex flex-col">
        <label className="text-xs text-zinc-500">Ends</label>
        <input
          name="endsAt"
          type="datetime-local"
          required
          className="rounded-lg border border-zinc-300 bg-white px-3 py-1.5 text-sm text-black outline-none transition-colors focus:border-violet-400 dark:border-zinc-700 dark:bg-zinc-950 dark:text-white"
        />
      </div>
      <div className="flex flex-col">
        <label className="text-xs text-zinc-500">Assigned to</label>
        <select
          name="assignedStaffId"
          className="rounded-lg border border-zinc-300 bg-white px-3 py-1.5 text-sm text-black outline-none transition-colors focus:border-violet-400 dark:border-zinc-700 dark:bg-zinc-950 dark:text-white"
        >
          <option value="">Unassigned</option>
          {staff.map((member) => (
            <option key={member.id} value={member.id}>
              {member.name}
            </option>
          ))}
        </select>
      </div>
      <button
        type="submit"
        disabled={pending}
        className="rounded-lg bg-gradient-to-r from-violet-600 to-fuchsia-500 px-4 py-1.5 text-sm font-medium text-white shadow-sm transition-transform hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
      >
        {pending ? "Creating…" : "Create shift"}
      </button>
      {state.error && <p className="w-full text-sm text-red-600 dark:text-red-400">{state.error}</p>}
    </form>
  );
}

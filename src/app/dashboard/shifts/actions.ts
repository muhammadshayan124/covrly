"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { CoverageError, requestCoverage } from "@/lib/coverage";
import { prisma } from "@/lib/prisma";
import { shiftSchema } from "@/lib/validation";

export interface ShiftFormState {
  error?: string;
}

export async function createShiftAction(
  _prevState: ShiftFormState,
  formData: FormData
): Promise<ShiftFormState> {
  const session = await auth();
  if (!session?.user) return { error: "Not authenticated" };

  const parsed = shiftSchema.safeParse({
    role: formData.get("role"),
    startsAt: formData.get("startsAt"),
    endsAt: formData.get("endsAt"),
    assignedStaffId: formData.get("assignedStaffId") || undefined,
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const startsAt = new Date(parsed.data.startsAt);
  const endsAt = new Date(parsed.data.endsAt);
  if (Number.isNaN(startsAt.getTime()) || Number.isNaN(endsAt.getTime())) {
    return { error: "Invalid date/time" };
  }
  if (endsAt <= startsAt) {
    return { error: "End time must be after start time" };
  }

  await prisma.shift.create({
    data: {
      organizationId: session.user.organizationId,
      role: parsed.data.role,
      startsAt,
      endsAt,
      assignedStaffId: parsed.data.assignedStaffId ?? null,
    },
  });

  revalidatePath("/dashboard/shifts");
  return {};
}

export async function requestCoverageAction(shiftId: string): Promise<void> {
  const session = await auth();
  if (!session?.user) return;

  try {
    await requestCoverage(session.user.organizationId, shiftId);
  } catch (err) {
    if (!(err instanceof CoverageError)) throw err;
    // Swallowed intentionally: this is a bound button action with no error channel back
    // to the UI. The shift's status is the source of truth the page re-renders from.
  }
  revalidatePath("/dashboard/shifts");
  revalidatePath("/dashboard");
}

"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { staffSchema } from "@/lib/validation";

export interface StaffFormState {
  error?: string;
}

export async function addStaffAction(
  _prevState: StaffFormState,
  formData: FormData
): Promise<StaffFormState> {
  const session = await auth();
  if (!session?.user) return { error: "Not authenticated" };

  const parsed = staffSchema.safeParse({
    name: formData.get("name"),
    phone: formData.get("phone"),
    priority: formData.get("priority") || 0,
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  await prisma.staffMember.create({
    data: {
      organizationId: session.user.organizationId,
      name: parsed.data.name,
      phone: parsed.data.phone,
      priority: parsed.data.priority,
    },
  });

  revalidatePath("/dashboard/staff");
  return {};
}

export async function removeStaffAction(staffId: string): Promise<void> {
  const session = await auth();
  if (!session?.user) return;

  await prisma.staffMember.deleteMany({
    where: { id: staffId, organizationId: session.user.organizationId },
  });
  revalidatePath("/dashboard/staff");
}

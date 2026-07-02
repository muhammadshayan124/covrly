"use server";

import { revalidatePath } from "next/cache";
import { CoverageError, respondToOffer } from "@/lib/coverage";
import { prisma } from "@/lib/prisma";

export async function respondAction(token: string, offerId: string, response: "accept" | "decline") {
  const staff = await prisma.staffMember.findUnique({ where: { portalToken: token } });
  if (!staff) throw new CoverageError("Invalid portal link");

  const offer = await prisma.coverageOffer.findUnique({ where: { id: offerId } });
  if (!offer || offer.staffMemberId !== staff.id) {
    throw new CoverageError("This offer does not belong to you");
  }

  await respondToOffer(offerId, response);
  revalidatePath(`/portal/${token}`);
}

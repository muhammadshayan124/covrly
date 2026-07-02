import { prisma } from "@/lib/prisma";
import { getNotificationProvider } from "@/lib/notify";
import { nextEligibleStaffId } from "@/lib/coverage-priority";

export class CoverageError extends Error {}
export { nextEligibleStaffId };

async function sendOffer(params: {
  organizationId: string;
  coverageRequestId: string;
  staffMemberId: string;
  sequence: number;
  shiftRole: string;
  shiftStartsAt: Date;
}) {
  const staff = await prisma.staffMember.findUniqueOrThrow({
    where: { id: params.staffMemberId },
  });

  const offer = await prisma.coverageOffer.create({
    data: {
      organizationId: params.organizationId,
      coverageRequestId: params.coverageRequestId,
      staffMemberId: params.staffMemberId,
      sequence: params.sequence,
      status: "pending",
    },
  });

  const portalUrl = `/portal/${staff.portalToken}`;
  const body = `Coverage needed: ${params.shiftRole} shift starting ${params.shiftStartsAt.toLocaleString()}. Reply at ${portalUrl} if you can cover it.`;

  const provider = getNotificationProvider();
  const result = await provider.send(staff.phone, body);

  await prisma.message.create({
    data: {
      organizationId: params.organizationId,
      coverageOfferId: offer.id,
      direction: "outbound",
      body: result.success ? body : `[FAILED TO SEND] ${body} (${result.error})`,
    },
  });

  return offer;
}

export async function requestCoverage(organizationId: string, shiftId: string) {
  const shift = await prisma.shift.findFirst({
    where: { id: shiftId, organizationId },
  });
  if (!shift) throw new CoverageError("Shift not found");
  if (shift.status === "needs_coverage") {
    throw new CoverageError("A coverage request is already open for this shift");
  }

  const staff = await prisma.staffMember.findMany({
    where: {
      organizationId,
      id: shift.assignedStaffId ? { not: shift.assignedStaffId } : undefined,
    },
    orderBy: { priority: "asc" },
  });
  if (staff.length === 0) {
    throw new CoverageError("No other staff available to offer this shift to");
  }

  const coverageRequest = await prisma.coverageRequest.create({
    data: { organizationId, shiftId, status: "open" },
  });

  await prisma.shift.update({
    where: { id: shiftId },
    data: { status: "needs_coverage" },
  });

  await sendOffer({
    organizationId,
    coverageRequestId: coverageRequest.id,
    staffMemberId: staff[0].id,
    sequence: 0,
    shiftRole: shift.role,
    shiftStartsAt: shift.startsAt,
  });

  return coverageRequest;
}

export async function respondToOffer(offerId: string, response: "accept" | "decline") {
  const offer = await prisma.coverageOffer.findUnique({
    where: { id: offerId },
    include: { coverageRequest: { include: { shift: true } } },
  });
  if (!offer) throw new CoverageError("Offer not found");
  if (offer.status !== "pending") {
    throw new CoverageError("This offer has already been resolved");
  }

  await prisma.message.create({
    data: {
      organizationId: offer.organizationId,
      coverageOfferId: offer.id,
      direction: "inbound",
      body: response === "accept" ? "YES, I can cover it" : "No, I can't cover it",
    },
  });

  if (response === "accept") {
    await prisma.$transaction([
      prisma.coverageOffer.update({
        where: { id: offer.id },
        data: { status: "accepted", respondedAt: new Date() },
      }),
      prisma.coverageOffer.updateMany({
        where: { coverageRequestId: offer.coverageRequestId, status: "pending", id: { not: offer.id } },
        data: { status: "expired" },
      }),
      prisma.coverageRequest.update({
        where: { id: offer.coverageRequestId },
        data: { status: "filled" },
      }),
      prisma.shift.update({
        where: { id: offer.coverageRequest.shiftId },
        data: { status: "covered", assignedStaffId: offer.staffMemberId },
      }),
    ]);
    return { status: "filled" as const };
  }

  await prisma.coverageOffer.update({
    where: { id: offer.id },
    data: { status: "declined", respondedAt: new Date() },
  });

  const originalAssigneeId = offer.coverageRequest.shift.assignedStaffId;
  const staffByPriority = await prisma.staffMember.findMany({
    where: {
      organizationId: offer.organizationId,
      id: originalAssigneeId ? { not: originalAssigneeId } : undefined,
    },
    orderBy: { priority: "asc" },
    select: { id: true },
  });
  const priorAndCurrentOffers = await prisma.coverageOffer.findMany({
    where: { coverageRequestId: offer.coverageRequestId },
    select: { staffMemberId: true },
  });
  const alreadyOffered = new Set(priorAndCurrentOffers.map((o) => o.staffMemberId));

  const nextStaffId = nextEligibleStaffId(
    staffByPriority.map((s) => s.id),
    alreadyOffered
  );

  if (!nextStaffId) {
    await prisma.$transaction([
      prisma.coverageRequest.update({
        where: { id: offer.coverageRequestId },
        data: { status: "exhausted" },
      }),
      prisma.shift.update({
        where: { id: offer.coverageRequest.shiftId },
        data: { status: "uncovered" },
      }),
    ]);
    return { status: "exhausted" as const };
  }

  await sendOffer({
    organizationId: offer.organizationId,
    coverageRequestId: offer.coverageRequestId,
    staffMemberId: nextStaffId,
    sequence: offer.sequence + 1,
    shiftRole: offer.coverageRequest.shift.role,
    shiftStartsAt: offer.coverageRequest.shift.startsAt,
  });

  return { status: "escalated" as const, nextStaffId };
}

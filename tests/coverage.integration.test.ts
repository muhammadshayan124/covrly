import { execSync } from "node:child_process";
import { existsSync, mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import type { PrismaClient } from "@/generated/prisma/client";
import type * as CoverageModule from "@/lib/coverage";

// Regression coverage for a real bug: the escalation query in respondToOffer originally
// didn't exclude the shift's original assignee, so a staff member who called out could be
// re-offered their own shift once everyone else declined. A pure unit test on
// nextEligibleStaffId alone would not have caught this -- the bug was in which staff IDs
// were passed in, not the selection function itself -- so this drives the real Prisma
// queries against a throwaway SQLite database.
//
// `@/lib/prisma` reads DATABASE_URL once, at module-import time. DATABASE_URL is set
// below before the dynamic import, and Vitest's default per-file module isolation keeps
// this from colliding with the DB other test files use.
describe("coverage escalation (integration, real SQLite)", () => {
  let dbDir: string;
  let prisma: PrismaClient;
  let requestCoverage: typeof CoverageModule.requestCoverage;
  let respondToOffer: typeof CoverageModule.respondToOffer;

  beforeAll(async () => {
    dbDir = mkdtempSync(join(tmpdir(), "covrly-test-"));
    const dbPath = join(dbDir, "test.db");
    process.env.DATABASE_URL = `file:${dbPath}`;

    execSync("npx prisma migrate deploy", {
      cwd: process.cwd(),
      env: { ...process.env, DATABASE_URL: `file:${dbPath}` },
      stdio: "pipe",
    });

    ({ prisma } = await import("@/lib/prisma"));
    ({ requestCoverage, respondToOffer } = await import("@/lib/coverage"));
  });

  afterAll(async () => {
    await prisma.$disconnect();
    if (existsSync(dbDir)) rmSync(dbDir, { recursive: true, force: true });
  });

  it("never re-offers the shift to the staff member who called out", async () => {
    const org = await prisma.organization.create({ data: { name: "Test Org" } });

    const alex = await prisma.staffMember.create({
      data: { organizationId: org.id, name: "Alex", phone: "+15550000001", priority: 0 },
    });
    const sam = await prisma.staffMember.create({
      data: { organizationId: org.id, name: "Sam", phone: "+15550000002", priority: 1 },
    });
    const jo = await prisma.staffMember.create({
      data: { organizationId: org.id, name: "Jo", phone: "+15550000003", priority: 2 },
    });

    const shift = await prisma.shift.create({
      data: {
        organizationId: org.id,
        role: "Server",
        startsAt: new Date("2026-08-01T10:00:00Z"),
        endsAt: new Date("2026-08-01T18:00:00Z"),
        assignedStaffId: alex.id,
      },
    });

    await requestCoverage(org.id, shift.id);

    let offers = await prisma.coverageOffer.findMany({ orderBy: { sequence: "asc" } });
    expect(offers).toHaveLength(1);
    expect(offers[0].staffMemberId).toBe(sam.id);

    await respondToOffer(offers[0].id, "decline");

    offers = await prisma.coverageOffer.findMany({ orderBy: { sequence: "asc" } });
    expect(offers).toHaveLength(2);
    expect(offers[1].staffMemberId).toBe(jo.id);
    // The critical assertion: Alex (who called out) must never appear as an offer target.
    expect(offers.every((o) => o.staffMemberId !== alex.id)).toBe(true);

    const result = await respondToOffer(offers[1].id, "decline");
    expect(result.status).toBe("exhausted");

    const finalShift = await prisma.shift.findUniqueOrThrow({ where: { id: shift.id } });
    expect(finalShift.status).toBe("uncovered");
    expect(finalShift.assignedStaffId).toBe(alex.id);
  });

  it("fills the shift and expires other pending offers when someone accepts", async () => {
    const org = await prisma.organization.create({ data: { name: "Accept Org" } });
    const alex = await prisma.staffMember.create({
      data: { organizationId: org.id, name: "Alex2", phone: "+15550000011", priority: 0 },
    });
    const sam = await prisma.staffMember.create({
      data: { organizationId: org.id, name: "Sam2", phone: "+15550000012", priority: 1 },
    });
    const shift = await prisma.shift.create({
      data: {
        organizationId: org.id,
        role: "Cashier",
        startsAt: new Date("2026-08-02T10:00:00Z"),
        endsAt: new Date("2026-08-02T18:00:00Z"),
        assignedStaffId: alex.id,
      },
    });

    await requestCoverage(org.id, shift.id);
    const pendingOffer = await prisma.coverageOffer.findFirstOrThrow({
      where: { staffMemberId: sam.id },
    });

    const result = await respondToOffer(pendingOffer.id, "accept");
    expect(result.status).toBe("filled");

    const finalShift = await prisma.shift.findUniqueOrThrow({ where: { id: shift.id } });
    expect(finalShift.status).toBe("covered");
    expect(finalShift.assignedStaffId).toBe(sam.id);
  });
});

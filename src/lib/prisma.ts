import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/prisma/client";

// Standard Next.js dev-mode singleton: without this, every hot reload would open a
// fresh connection pool and eventually exhaust the database's connection limit.
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

function createClient(): PrismaClient {
  if (!process.env.DATABASE_URL) {
    throw new Error(
      "DATABASE_URL is not set. Provision a Postgres database (e.g. Vercel Postgres/Neon) " +
        "and set DATABASE_URL to its connection string."
    );
  }
  const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
  return new PrismaClient({ adapter });
}

function getClient(): PrismaClient {
  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = createClient();
  }
  return globalForPrisma.prisma;
}

// A Proxy defers construction (and the DATABASE_URL check above) until the first actual
// query, e.g. `prisma.staffMember.findMany()`. This matters because Next's build-time
// "collect page data" step imports every route module to read its config/exports -- it
// doesn't execute request logic -- so eager construction at module scope would make
// `next build` fail without a database, even for routes that only need one at runtime.
export const prisma: PrismaClient = new Proxy({} as PrismaClient, {
  get(_target, prop, receiver) {
    return Reflect.get(getClient() as object, prop, receiver);
  },
});

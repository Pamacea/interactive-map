import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // Use 'require' instead of 'verify-full' for faster SSL handshake in serverless
  // See: https://www.postgresql.org/docs/current/libpq-ssl.html
  sslmode: "require",
  // Connection pool optimization for serverless environments
  max: 6,
  min: 1,
  idleTimeoutMillis: 10000,
  connectionTimeoutMillis: 5000,
});
const adapter = new PrismaPg(pool);

export const prisma = globalForPrisma.prisma ?? new PrismaClient(
  { adapter },
  {
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  }
);

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

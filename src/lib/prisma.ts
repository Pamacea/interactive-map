import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // Explicitly set sslmode=verify-full to prevent security downgrade in pg v9.0.0
  // See: https://www.postgresql.org/docs/current/libpq-ssl.html
  sslmode: "verify-full",
  ssl: {
    rejectUnauthorized: true,
  },
  // Connection pool optimization for serverless environments
  max: 10,
  min: 2,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
});
const adapter = new PrismaPg(pool);

export const prisma = globalForPrisma.prisma ?? new PrismaClient(
  { adapter },
  {
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  }
);

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

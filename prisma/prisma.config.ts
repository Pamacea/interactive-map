import { defineConfig } from "@prisma/config"

export default defineConfig({
  schema: "schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: "postgresql://neondb_owner:npg_87zQDfghFBOy@ep-purple-cake-agbzn8vp-pooler.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require",
  },
})

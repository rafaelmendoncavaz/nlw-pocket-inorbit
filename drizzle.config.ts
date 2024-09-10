import { defineConfig } from "drizzle-kit"
export default defineConfig({
  schema: "./src/db/schema/index.ts",
  out: "./.migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: `postgresql://${process.env.PG_USER}:${process.env.PG_PASSWORD}@${process.env.PG_HOST}:${process.env.PG_PORT}/${process.env.PG_DB}`,
  },
})

import { drizzle } from "drizzle-orm/postgres-js"
import postgres from "postgres"
import * as schema from "./index"

export const client = postgres(
  `postgresql://${process.env.PG_USER}:${process.env.PG_PASSWORD}@${process.env.PG_HOST}:${process.env.PG_PORT}/${process.env.PG_DB}`
)
export const db = drizzle(client, {
  schema,
  logger: true,
})

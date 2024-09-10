import { z } from "zod"

const envSchema = z.object({
  PG_USER: z.string(),
  PG_PASSWORD: z.string(),
  PG_HOST: z.string(),
  PG_PORT: z.number(),
  PG_DATABASE: z.string(),
})

export const env = envSchema.parse(process.env)

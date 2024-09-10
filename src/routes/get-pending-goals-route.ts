import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod"
import { getPendingGoals } from "../services/get-pending-goals"

const getPendingGoalsRoute: FastifyPluginAsyncZod = async app => {
  app.get("/pending-goals", async () => {
    const { pendingGoals } = await getPendingGoals()

    return {
      pendingGoals,
    }
  })
}

export default getPendingGoalsRoute

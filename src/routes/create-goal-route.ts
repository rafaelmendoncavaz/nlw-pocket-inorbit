import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod"
import { createGoalSchema } from "../schemas/schema"
import { createGoal } from "../services/create-goal"

const createGoalRoute: FastifyPluginAsyncZod = async app => {
  app.post(
    "/goals",
    {
      schema: {
        body: createGoalSchema,
      },
    },
    async req => {
      const { title, desiredWeeklyFrequency } = req.body

      await createGoal({
        title,
        desiredWeeklyFrequency,
      })
    }
  )
}

export default createGoalRoute

import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod"
import { createGoalCompletionSchema } from "../schemas/schema"
import { createGoalCompletion } from "../services/create-goal-completion"

const createGoalCompletionRoute: FastifyPluginAsyncZod = async app => {
  app.post(
    "/completions",
    {
      schema: {
        body: createGoalCompletionSchema,
      },
    },
    async req => {
      const { goalId } = req.body

      await createGoalCompletion({
        goalId,
      })
    }
  )
}

export default createGoalCompletionRoute

import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod"
import { deleteGoalSchema } from "../schemas/schema"
import { deleteGoal } from "../services/delete-goal"

const deleteGoalRoute: FastifyPluginAsyncZod = async app => {
  app.delete(
    "/delete-goal",
    {
      schema: {
        body: deleteGoalSchema,
      },
    },
    async req => {
      const { id } = req.body

      await deleteGoal({ id })
    }
  )
}

export default deleteGoalRoute

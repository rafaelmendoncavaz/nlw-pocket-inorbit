import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod"
import { deleteCompletionSchema } from "../schemas/schema"
import { deleteCompletion } from "../services/delete-completion"

const deleteCompletionRoute: FastifyPluginAsyncZod = async app => {
  app.delete(
    "/delete-completion",
    {
      schema: {
        body: deleteCompletionSchema,
      },
    },
    async req => {
      const { goalId } = req.body

      await deleteCompletion({ goalId })
    }
  )
}

export default deleteCompletionRoute

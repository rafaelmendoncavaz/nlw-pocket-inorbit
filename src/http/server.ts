import fastify from "fastify"
import {
  serializerCompiler,
  validatorCompiler,
  type ZodTypeProvider,
} from "fastify-type-provider-zod"
import { createGoalCompletionSchema, createGoalSchema } from "../schemas/schema"
import { createGoal } from "../services/create-goal"
import { getPendingGoals } from "../services/get-pending-goals"
import { createGoalCompletion } from "../services/create-goal-completion"

export const app = fastify().withTypeProvider<ZodTypeProvider>()

app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)

const port = 3000

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

app.get("/pending-goals", async () => {
  const { pendingGoals } = await getPendingGoals()

  return {
    pendingGoals,
  }
})

app
  .listen({
    port: port,
  })
  .then(() => {
    console.log(`Server is running on port ${port}`)
  })

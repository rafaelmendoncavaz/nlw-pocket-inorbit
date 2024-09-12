import {
  serializerCompiler,
  validatorCompiler,
  type ZodTypeProvider,
} from "fastify-type-provider-zod"
import fastify from "fastify"
import createGoalRoute from "../routes/create-goal-route"
import createGoalCompletionRoute from "../routes/create-goal-completion-route"
import getPendingGoalsRoute from "../routes/get-pending-goals-route"
import getWeekSummaryRoute from "../routes/get-week-summary-route"
import fastifyCors from "@fastify/cors"
import deleteCompletionRoute from "../routes/delete-completions-route"
import deleteGoalRoute from "../routes/delete-goal-route"

export const app = fastify().withTypeProvider<ZodTypeProvider>()

app.register(fastifyCors, {
  origin: "*",
})

app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)

app.register(createGoalRoute)
app.register(createGoalCompletionRoute)
app.register(getPendingGoalsRoute)
app.register(getWeekSummaryRoute)
app.register(deleteCompletionRoute)
app.register(deleteGoalRoute)

const port = 3000

app
  .listen({
    port: port,
  })
  .then(() => {
    console.log(`Server is running on port ${port}`)
  })

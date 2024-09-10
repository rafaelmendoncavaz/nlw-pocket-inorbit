import { app } from "../http/server"
import { createGoalSchema } from "../schemas/schema"
import { createGoal } from "../services/create-goal"

const createGoalRoute = app.post("/goals", async req => {
  const body = createGoalSchema.parse(req.body)

  await createGoal({
    title: body.title,
    desiredWeeklyFrequency: body.desiredWeeklyFrequency,
  })
})

export default createGoalRoute

import dayjs from "dayjs"
import { db } from "../db/schema/dbconnect"
import { goalCompletions, goals } from "../db/schema"
import { and, count, eq, gte, lte, sql } from "drizzle-orm"

export async function getPendingGoals() {
  const firstDayOfWeek = dayjs().startOf("week").toDate()
  const lastDayOfWeek = dayjs().endOf("week").toDate()

  const upToWeekCreatedGoals = db.$with("up_to_week_created_goals").as(
    db
      .select({
        id: goals.id,
        title: goals.title,
        desiredWeeklyFrequency: goals.desiredWeeklyFrequency,
        createdAt: goals.createdAt,
      })
      .from(goals)
      .where(lte(goals.createdAt, lastDayOfWeek))
  )

  const goalCompletionCounter = db.$with("goal_completion_counter").as(
    db
      .select({
        goalId: goalCompletions.goalId,
        completionCounter: count(goalCompletions.id).as("completionCounter"),
      })
      .from(goalCompletions)
      .where(
        and(
          gte(goalCompletions.createdAt, firstDayOfWeek),
          lte(goalCompletions.createdAt, lastDayOfWeek)
        )
      )
      .groupBy(goalCompletions.goalId)
  )

  const pendingGoals = await db
    .with(upToWeekCreatedGoals, goalCompletionCounter)
    .select({
      id: upToWeekCreatedGoals.id,
      title: upToWeekCreatedGoals.title,
      desiredWeeklyFrequency: upToWeekCreatedGoals.desiredWeeklyFrequency,
      completionCount: sql`
      COALESCE(${goalCompletionCounter.completionCounter}, 0)
      `.mapWith(Number),
    })
    .from(upToWeekCreatedGoals)
    .leftJoin(
      goalCompletionCounter,
      eq(goalCompletionCounter.goalId, upToWeekCreatedGoals.id)
    )

  return {
    pendingGoals,
  }
}

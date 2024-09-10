import { count, eq, sql } from "drizzle-orm"
import { and, gte, lte } from "drizzle-orm"
import { goalCompletions, goals } from "../db/schema"
import { db } from "../db/schema/dbconnect"
import type { CreateGoalCompletion } from "../interfaces/interfaces"
import dayjs from "dayjs"

export async function createGoalCompletion({ goalId }: CreateGoalCompletion) {
  const firstDayOfWeek = dayjs().startOf("week").toDate()
  const lastDayOfWeek = dayjs().endOf("week").toDate()

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
          lte(goalCompletions.createdAt, lastDayOfWeek),
          eq(goalCompletions.goalId, goalId)
        )
      )
      .groupBy(goalCompletions.goalId)
  )

  const result = await db
    .with(goalCompletionCounter)
    .select({
      desiredWeeklyFrequency: goals.desiredWeeklyFrequency,
      completionCount: sql`
      COALESCE(${goalCompletionCounter.completionCounter}, 0)
      `.mapWith(Number),
    })
    .from(goals)
    .leftJoin(goalCompletionCounter, eq(goalCompletionCounter.goalId, goals.id))
    .where(eq(goals.id, goalId))
    .limit(1)

  const { completionCount, desiredWeeklyFrequency } = result[0]

  if (completionCount >= desiredWeeklyFrequency) {
    throw new Error("Goal completion limit reached")
  }

  const insertResult = await db
    .insert(goalCompletions)
    .values({ goalId })
    .returning()

  const goalCompletion = insertResult[0]

  return {
    goalCompletion,
  }
}

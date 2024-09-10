import dayjs from "dayjs"
import { db } from "../db/schema/dbconnect"
import { goalCompletions, goals } from "../db/schema"
import { and, count, eq, gte, lte, sql } from "drizzle-orm"

export async function getWeekSummary() {
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

  const goalsCompletedInWeek = db.$with("goal_completed_in_week").as(
    db
      .select({
        id: goalCompletions.id,
        title: goals.title,
        completedDate: sql`
        DATE(${goalCompletions.createdAt})
        `.as("completedDate"),
        completedAt: goalCompletions.createdAt,
      })
      .from(goalCompletions)
      .innerJoin(goals, eq(goals.id, goalCompletions.id))
      .where(
        and(
          gte(goalCompletions.createdAt, firstDayOfWeek),
          lte(goalCompletions.createdAt, lastDayOfWeek)
        )
      )
  )

  const goalsCompletedAtWeekDay = db.$with("goals_completed_at_week_day").as(
    db
      .select({
        completedDate: goalsCompletedInWeek.completedDate,
        completions: sql`
        JSON_AGG(
          JSON_BUILD_OBJECT(
            "id", ${goalsCompletedInWeek.id},
            "title", ${goalsCompletedInWeek.title},
            "completedAt", ${goalsCompletedInWeek.completedAt},
          )
        )
      `.as("completions"),
      })
      .from(goalsCompletedInWeek)
      .groupBy(goalsCompletedInWeek.completedDate)
  )

  const result = await db
    .with(upToWeekCreatedGoals, goalsCompletedInWeek, goalsCompletedAtWeekDay)
    .select({
      completed: sql`
      (SELECT COUNT(*) FROM ${goalsCompletedInWeek}),
      `.mapWith(Number),
      total: sql`
      (SELECT SUM(${upToWeekCreatedGoals.desiredWeeklyFrequency}) FROM ${upToWeekCreatedGoals}),
      `.mapWith(Number),
      goalsPerDay: sql`
      JSON_OBJECT_AGG(
        ${goalsCompletedAtWeekDay.completedDate}, ${goalsCompletedAtWeekDay.completions},
      )
      `,
    })
    .from(goalsCompletedAtWeekDay)

  return {
    summary: result,
  }
}

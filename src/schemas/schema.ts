import { z } from "zod"

export const createGoalSchema = z.object({
  title: z.string(),
  desiredWeeklyFrequency: z.number().int().min(1).max(7),
})

export const createGoalCompletionSchema = z.object({
  goalId: z.string(),
})

export const deleteCompletionSchema = z.object({
  goalId: z.string(),
})

export const deleteGoalSchema = z.object({
  id: z.string(),
})

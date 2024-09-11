export interface CreateGoalRequest {
  title: string
  desiredWeeklyFrequency: number
}

export interface CreateGoalCompletion {
  goalId: string
}

export type GoalsPerDay = Record<
  string,
  {
    id: string
    title: string
    completedAt: string
  }[]
>

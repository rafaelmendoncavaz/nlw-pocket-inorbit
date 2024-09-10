export interface CreateGoalRequest {
  title: string
  desiredWeeklyFrequency: number
}

export interface CreateGoalCompletion {
  goalId: string
}

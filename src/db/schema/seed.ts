import { goalCompletions, goals } from "."
import { client, db } from "./dbconnect"
import dayjs from "dayjs"

async function seed() {
  await db.delete(goalCompletions)
  await db.delete(goals)

  const result = await db
    .insert(goals)
    .values([
      {
        title: "Acordar cedo",
        desiredWeeklyFrequency: 5,
      },
      {
        title: "Ir pra academia",
        desiredWeeklyFrequency: 5,
      },
      {
        title: "Ler",
        desiredWeeklyFrequency: 1,
      },
    ])
    .returning()

  const startOfWeek = dayjs().startOf("week")

  await db.insert(goalCompletions).values([
    {
      goalId: result[0].id,
      createdAt: startOfWeek.toDate(),
    },
    {
      goalId: result[1].id,
      createdAt: startOfWeek.add(1, "day").toDate(),
    },
  ])
}

seed().finally(() => {
  client.end()
})

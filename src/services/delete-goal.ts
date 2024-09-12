import { eq } from "drizzle-orm"
import { goals } from "../db/schema"
import { db } from "../db/schema/dbconnect"

export async function deleteGoal({ id }: { id: string }) {
  await db.delete(goals).where(eq(goals.id, id))
}

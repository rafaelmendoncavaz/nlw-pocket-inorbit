import { eq } from "drizzle-orm"
import { goalCompletions } from "../db/schema"
import { db } from "../db/schema/dbconnect"

export async function deleteCompletion({ goalId }: { goalId: string }) {
  await db.delete(goalCompletions).where(eq(goalCompletions.id, goalId))
}

import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod"
import { getWeekSummary } from "../services/get-week-summary"

const getWeekSummaryRoute: FastifyPluginAsyncZod = async app => {
  app.get("/summary", async () => {
    const { summary } = await getWeekSummary()

    return {
      summary,
    }
  })
}

export default getWeekSummaryRoute

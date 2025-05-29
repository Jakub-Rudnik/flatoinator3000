import { query } from "./_generated/server";

export const getCounters = query({
    handler: async (ctx) => {
        return await ctx.db.query("counters").collect();
    }
})
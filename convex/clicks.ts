import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getTodaysClicks = query({
    args: { counterId: v.id("counters") },
    handler: async (ctx, args) => {
        const clicks = await ctx.db.query("clicks").withIndex("by_counterId", (q) => q.eq("counterId", args.counterId)).collect();

        const filteredClicks = clicks.filter((click) => {
            const clickDate = new Date(click._creationTime).toISOString().split('T')[0];
            const today = new Date().toISOString().split('T')[0];

            return clickDate === today;
        });

        return filteredClicks;
    }
})

export const addClick = mutation({
    args: { counterId: v.id("counters") },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();

        if (!identity == null) {
            throw new Error("User is not authenticated");
        }

        await ctx.db.insert("clicks", {
            userEmail: identity?.email!,
            counterId: args.counterId,
        });
    }
})
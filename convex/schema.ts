import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
    clicks: defineTable({
        userEmail: v.string(),
        counterId: v.id("counters"),
    }).index("by_counterId", ["counterId"]),
    counters: defineTable({
        name: v.string(),
        description: v.string(),
        buttonText: v.string(),
    }),
})
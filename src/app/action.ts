"use server";

import { db } from "@/server/db";
import { days } from "@/server/db/schema";
import { eq } from "drizzle-orm";

export async function addOne() {
  const today = new Date().toISOString().split("T")[0]!;

  const day = await db.query.days.findFirst({
    where: (days, { eq }) => eq(days.date, today),
  });

  if (day) {
    return db
      .update(days)
      .set({ amount: day.amount + 1 })
      .where(eq(days.id, day.id))
      .returning();
  }

  return null;
}

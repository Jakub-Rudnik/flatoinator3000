// src/app/api/socket/route.ts
import { NextResponse } from "next/server";
import { db } from "@/server/db";
import { days } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { pusherServer } from "@/lib/pusher-server";

type RequestBody = {
  action: string;
};

export async function POST(req: Request) {
  const body = (await req.json()) as RequestBody;
  const { action } = body;

  if (action === "increment") {
    const today = new Date().toISOString().split("T")[0]!;
    const day = await db.query.days.findFirst({
      where: (days, { eq }) => eq(days.date, today),
    });

    if (day) {
      const newAmount = day.amount + 1;
      await db
        .update(days)
        .set({ amount: newAmount })
        .where(eq(days.date, today));

      // Broadcast the update via Pusher
      await pusherServer.trigger("counter-channel", "counter-update", {
        amount: newAmount,
      });

      return NextResponse.json({ success: true, amount: newAmount });
    }
  }

  return NextResponse.json({ success: false });
}

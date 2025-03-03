// src/app/api/socket/route.ts
import { db } from "@/server/db";
import { days } from "@/server/db/schema";
import { eq, sql } from "drizzle-orm";
import { pusherServer } from "@/lib/pusher-server";

type RequestBody = {
  action: string;
};

function today() {
  return new Date().toISOString().split("T")[0];
}

// api/socket/route.ts
export async function POST(req: Request) {
  try {
    const { action } = (await req.json()) as RequestBody;

    if (action === "increment") {
      // Use a more efficient update query
      const result = await db.transaction(async (tx) => {
        // Update and return the new value in a single operation
        const [updated] = await tx
          .update(days)
          .set({
            amount: sql`amount
                        + 1`,
          })
          .where(eq(days.date, today()!))
          .returning({ amount: days.amount });

        return updated;
      });

      // Send only the updated value to Pusher
      await pusherServer.trigger("counter-channel", "counter-update", {
        amount: result?.amount,
      });

      return Response.json({ success: true, amount: result?.amount });
    }

    return Response.json(
      { success: false, error: "Invalid action" },
      { status: 400 },
    );
  } catch (error) {
    console.error(error);
    return Response.json(
      { success: false, error: "Internal server error" },
      { status: 500 },
    );
  }
}

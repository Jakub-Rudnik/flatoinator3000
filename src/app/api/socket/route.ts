import { db } from "@/server/db";
import { clicks } from "@/server/db/schema";
import { pusherServer } from "@/lib/pusher-server";

type RequestBody = {
  action: string;
};

function today() {
  return new Date().toLocaleString("en-PL", {
    timeZone: "Europe/Warsaw",
  });
}

export async function POST(req: Request) {
  try {
    const { action } = (await req.json()) as RequestBody;

    if (action === "increment") {
      await db.insert(clicks).values({});
      const result = await db.query.clicks.findMany({
        where: (clicks, { sql }) => sql`DATE(
                ${clicks.createdAt}
                )
                =
                ${today()}`,
      });

      await pusherServer.trigger("state-channel", "state-update", {
        amount: result.length,
        clicks: result,
      });

      return Response.json({ success: true, error: null });
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

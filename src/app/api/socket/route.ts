import { db } from "@/server/db";
import { clicks } from "@/server/db/schema";
import { pusherServer } from "@/lib/pusher-server";
import { auth } from "@clerk/nextjs/server";

type RequestBody = {
  counterId: number;
};

function today() {
  return new Date().toLocaleString("en-PL", {
    timeZone: "Europe/Warsaw",
  });
}

export async function POST(req: Request) {
  const { counterId } = (await req.json()) as RequestBody;
  const { userId } = await auth();

  if (userId && counterId) {
    try {
      await db.insert(clicks).values({
        userId: userId,
        counterId: counterId,
      });

      await pusherServer.trigger(`counter-${counterId}`, "update", {
        action: "update"
      });

      return Response.json({ success: true, error: null });

    } catch (error) {
      console.error(error);
      return Response.json(
        { success: false, error: "Internal server error" },
        { status: 500 },
      );
    }
  }

  return Response.json(
    { success: false, error: "Provide counterId and userId" },
    { status: 400 },
  );
}

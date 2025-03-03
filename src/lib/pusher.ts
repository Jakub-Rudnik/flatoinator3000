import Pusher from "pusher-js";
import { env } from "@/env";

export const pusherClient = new Pusher(env.NEXT_PUBLIC_PUSHER_KEY, {
  cluster: env.NEXT_PUBLIC_PUSHER_CLUSTER,
  forceTLS: true,
  enabledTransports: ["ws", "wss"],
  disabledTransports: ["xhr_streaming", "xhr_polling"],
});

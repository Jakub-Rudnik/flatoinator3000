import { db } from "@/server/db";
import Counter from "@/components/counter";
import { getClicksToday } from "./action";

export const dynamic = "force-dynamic";

export const revalidate = 0;

export default async function HomePage(
  locales?: Intl.LocalesArgument,
  options?: Intl.DateTimeFormatOptions,
) {
  const todayDate = new Date().toLocaleString("en-PL", {
    timeZone: "Europe/Warsaw",
  });

  const clicks = await getClicksToday(1);

  const counter = await db.query.counters.findFirst({
    where: (counters, { eq }) => eq(counters.id, 1),
  });

  return (
    <main className="flex w-full flex-col items-center justify-start">
      <Counter counter={counter!} initialClicks={clicks.length} />
    </main>
  );
}

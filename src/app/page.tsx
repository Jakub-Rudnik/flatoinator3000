import { fetchQuery, preloadQuery } from "convex/nextjs";
import { api } from "convex/_generated/api";
import Counter, { CounterWithClick } from "@/components/counter";

export default async function HomePage(
  locales?: Intl.LocalesArgument,
  options?: Intl.DateTimeFormatOptions,
) {
  async function loadCounters() {
    let countersWithClicks: CounterWithClick[] = [];

    const counters = await fetchQuery(api.counters.getCounters);

    await counters.forEach(async (counter) => {
      const clicks = await preloadQuery(api.clicks.getTodaysClicks, { counterId: counter._id });
      countersWithClicks.push({
        ...counter,
        clicks: clicks,
      });

    });

    return countersWithClicks;
  }

  const countersWithClicks = await loadCounters();

  return (
    <main className="flex w-full flex-col items-center justify-start">
      {countersWithClicks && countersWithClicks.length == 0 && (
        <div className="flex flex-col items-center justify-center gap-5 py-10">
          Brak liczników
        </div>
      )}
      {countersWithClicks && countersWithClicks.length > 0 && countersWithClicks.map((counter) => (
        <Counter key={counter._creationTime} counterData={counter} />
      ))}
    </main>
  );
}

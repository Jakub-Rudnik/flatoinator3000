import { fetchQuery } from "convex/nextjs";
import { api } from "convex/_generated/api";
import Counter, { CounterWithClick } from "@/components/counter";

export default async function HomePage(
  locales?: Intl.LocalesArgument,
  options?: Intl.DateTimeFormatOptions,
) {
  const counters = await fetchQuery(api.counters.getCounters);

  return (
    <main className="flex w-full flex-col items-center justify-start">
      {counters && counters.length === 0 && (
        <div className="flex flex-col items-center justify-center gap-5 py-10">
          Brak liczników
        </div>
      )}
      {counters && counters.length > 0 && counters.map((counter) => (
        <Counter key={counter._creationTime} _id={counter._id} name={counter.name} description={counter.description} buttonText={counter.buttonText} />
      ))}
    </main>
  );
}

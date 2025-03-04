import { db } from "@/server/db";
import Counter from "@/components/counter";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Picker from "@/components/picker";
import { CounterProvider } from "@/lib/counter-context";
import { LinearChart } from "@/components/linear-chart";

export const dynamic = "force-dynamic";

export const revalidate = 0;

export default async function HomePage() {
  const occurrences = await db.query.days.findMany();

  const todayDate = new Date().toISOString().split("T")[0]!;
  const clicks = await db.query.clicks.findMany({
    where: (clicks, { sql }) => sql`DATE(
        ${clicks.createdAt}
        )
        =
        ${todayDate}`,
  });

  const formattedClicks = clicks.map((click) => click.createdAt?.getUTCHours());

  const chartData = Array.from({ length: 24 }, (_, i) => ({
    hour: i.toString(),
    amount: formattedClicks.filter((hour) => hour === i).length,
  }));

  return (
    <main className="flex w-full flex-col items-center justify-start">
      <CounterProvider initialAmount={clicks.length}>
        <Tabs
          className="flex w-full flex-col items-center justify-center pt-5"
          defaultValue="today"
        >
          <TabsList>
            <TabsTrigger value="today">Dzisiaj</TabsTrigger>
            <TabsTrigger value="history">Wybierz dzień</TabsTrigger>
          </TabsList>
          <TabsContent value="today">
            <div className="flex flex-col items-center justify-center gap-5 py-10">
              <h1 className="scroll-m-20 text-center text-4xl font-extrabold tracking-tight lg:text-5xl">
                Ile Hanka płaska dzisiaj?
              </h1>
              <Counter />
              <LinearChart data={chartData} />
            </div>
          </TabsContent>
          <TabsContent value="history">
            <Picker occurrences={occurrences} />
          </TabsContent>
        </Tabs>
      </CounterProvider>
    </main>
  );
}

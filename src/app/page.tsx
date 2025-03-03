import { db } from "@/server/db";
import { days } from "@/server/db/schema";
import Counter from "@/components/counter";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Picker from "@/components/picker";
import { CounterProvider } from "@/lib/counter-context";

export const dynamic = "force-dynamic";

export const revalidate = 0;

export default async function HomePage() {
  const occurrences = await db.query.days.findMany();

  const todayDate = new Date().toISOString().split("T")[0]!;
  let day = await db.query.days.findFirst({
    where: (days, { eq }) => eq(days.date, todayDate),
  });

  if (!day) {
    const inserted = await db
      .insert(days)
      .values({
        amount: 0,
        date: todayDate,
      })
      .returning();
    day = inserted[0];
  }

  return (
    <main className="flex w-full flex-col items-center justify-start">
      <CounterProvider initialAmount={day!.amount}>
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

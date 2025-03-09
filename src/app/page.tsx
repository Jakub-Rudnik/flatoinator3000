import { db } from "@/server/db";
import Counter from "@/components/counter";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Charts } from "@/components/charts";
import { StateProvider } from "@/lib/state-context";

export const dynamic = "force-dynamic";

export const revalidate = 0;

export default async function HomePage(
  locales?: Intl.LocalesArgument,
  options?: Intl.DateTimeFormatOptions,
) {
  const todayDate = new Date().toLocaleString("en-PL", {
    timeZone: "Europe/Warsaw",
  });

  const clicks = await db.query.clicks.findMany({
    where: (clicks, { sql }) => sql`DATE(
        ${clicks.createdAt}
        )
        =
        ${todayDate}`,
  });

  return (
    <main className="flex w-full flex-col items-center justify-start">
      <StateProvider initialClicks={clicks}>
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
              <Charts />
            </div>
          </TabsContent>
          <TabsContent value="history">
            {/*<Picker occurrences={occurrences} />*/}
          </TabsContent>
        </Tabs>
      </StateProvider>
    </main>
  );
}

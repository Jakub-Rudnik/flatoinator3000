"use client";

import { Calendar } from "@/components/ui/calendar";
import { useCallback, useEffect, useState } from "react";
import type { day } from "@/server/db/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatLocalDate } from "@/lib/utils";
import { useCounter } from "@/lib/counter-context";

export type PickerProps = {
  occurrences: day[];
};

export default function Picker({ occurrences }: PickerProps) {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [amount, setAmount] = useState<number>(0);
  const { amount: todayAmount } = useCounter();

  const findAmount = useCallback(
    (date: Date | undefined): number => {
      if (!date) return 0;

      const selectedDate = formatLocalDate(date);
      const day = occurrences.find((day) => day?.date === selectedDate);
      return day?.amount ?? 0;
    },
    [occurrences],
  );

  useEffect(() => {
    if (date) {
      // If today's date is selected, use the shared counter value
      const todayDate = formatLocalDate(new Date());
      const selectedDate = formatLocalDate(date);

      if (selectedDate === todayDate) {
        setAmount(todayAmount);
      } else {
        const newAmount = findAmount(date);
        setAmount(newAmount);
      }
    }
  }, [date, findAmount, occurrences, todayAmount]);

  function handleSelect(selectedDate: Date | undefined) {
    setDate(selectedDate);
  }

  return (
    <div className="flex w-full flex-col items-center gap-4">
      <Calendar
        mode="single"
        occurrences={occurrences}
        selected={date}
        onSelect={handleSelect}
        className="w-full"
      />
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>
            Ile płaska Hanka {date ? formatLocalDate(date) : "wtedy"}?
          </CardTitle>
        </CardHeader>
        <CardContent>
          <h2 className="scroll-m-20 text-center text-4xl font-extrabold tracking-tight lg:text-5xl">
            {amount}
          </h2>
        </CardContent>
      </Card>
    </div>
  );
}

"use client";

import { Calendar } from "@/components/ui/calendar";
import { useState } from "react";
import type { day } from "@/server/db/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatLocalDate } from "@/lib/utils";

export type PickerProps = {
  occurrences: day[];
};

export default function Picker({ occurrences }: PickerProps) {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [amount, setAmount] = useState<number | undefined>(findAmount(date));

  function findAmount(date: Date | undefined) {
    const selectedDate = formatLocalDate(date!);
    const day = occurrences.find((day) => day?.date === selectedDate);
    return day ? day.amount : 0;
  }

  function handleSelect(date: Date | undefined) {
    setDate(date);
    setAmount(findAmount(date));
  }

  return (
    <>
      <Calendar
        mode="single"
        occurrences={occurrences}
        selected={date}
        onSelect={handleSelect}
        className="w-full"
      />
      <Card>
        <CardHeader>
          <CardTitle>Ile płaska Hanka wtedy?</CardTitle>
        </CardHeader>
        <CardContent>
          <h2 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
            {amount}
          </h2>
        </CardContent>
      </Card>
    </>
  );
}

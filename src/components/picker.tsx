"use client";

import { Calendar } from "@/components/ui/calendar";
import { useCallback, useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatLocalDate } from "@/lib/utils";

// export type PickerProps = {
//   occurrences: day[];
// };

export default function Picker() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [amount, setAmount] = useState<number>(0);

  // const findAmount = useCallback(
  //   (date: Date | undefined): number => {
  //     if (!date) return 0;

  //     const selectedDate = formatLocalDate(date);
  //     const day = occurrences.find((day) => day?.date === selectedDate);
  //     return day?.amount ?? 0;
  //   },
  //   [occurrences],
  // );

  // useEffect(() => {
  //   if (date) {
  //     const todayDate = formatLocalDate(new Date());
  //     const selectedDate = formatLocalDate(date);

  //     if (selectedDate === todayDate) {
  //       setAmount(todayAmount);
  //     } else {
  //       const newAmount = findAmount(date);
  //       setAmount(newAmount);
  //     }
  //   }
  // }, [date, findAmount, occurrences, todayAmount]);

  function handleSelect(selectedDate: Date | undefined) {
    setDate(selectedDate);
  }

  return (
    // <div className="flex w-full flex-col items-center gap-4">
    //   <Calendar
    //     mode="single"
    //     occurrences={occurrences}
    //     selected={date}
    //     onSelect={handleSelect}
    //     className="w-full"
    //   />
    //   <Card className="w-full max-w-md">
    //     <CardHeader>
    //       <CardTitle>
    //         Ile płaska Hanka {date ? formatLocalDate(date) : "wtedy"}?
    //       </CardTitle>
    //     </CardHeader>
    //     <CardContent>
    //       <h2 className="scroll-m-20 text-center text-4xl font-extrabold tracking-tight lg:text-5xl">
    //         {amount}
    //       </h2>
    //     </CardContent>
    //   </Card>
    // </div>
  );
}

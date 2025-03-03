// src/components/counter.tsx
"use client";

import { Button } from "@/components/ui/button";
import { useCounter } from "@/lib/counter-context";

export default function Counter() {
  const { amount, debouncedIncrement } = useCounter();

  return (
    <>
      <h2 className="scroll-m-20 pb-2 text-5xl font-semibold tracking-tight first:mt-0">
        {amount}
      </h2>
      <Button
        size="lg"
        onClick={debouncedIncrement}
        className="bg-[url(/wood.webp)] bg-cover bg-center text-white"
      >
        Wypłaszcz
      </Button>
    </>
  );
}

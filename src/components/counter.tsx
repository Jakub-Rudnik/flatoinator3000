// src/components/counter.tsx
"use client";

import { Button } from "@/components/ui/button";
import { useCounter } from "@/lib/counter-context";
import { useState } from "react";

export default function Counter() {
  const { amount, incrementCounter } = useCounter();
  const [isIncrementing, setIsIncrementing] = useState(false);

  const handleClick = async () => {
    if (isIncrementing) return;

    setIsIncrementing(true);
    try {
      await incrementCounter();
    } finally {
      setIsIncrementing(false);
    }
  };

  return (
    <>
      <h2 className="scroll-m-20 pb-2 text-5xl font-semibold tracking-tight first:mt-0">
        {amount}
      </h2>
      <Button
        size="lg"
        onClick={handleClick}
        disabled={isIncrementing}
        className="bg-[url(/wood.webp)] bg-cover bg-center text-white"
      >
        Wypłaszcz
      </Button>
    </>
  );
}

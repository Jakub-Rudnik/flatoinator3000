"use client";

import { Button } from "@/components/ui/button";
import { useAppState } from "@/lib/state-context";
import { useState } from "react";
import { useUser } from "@clerk/nextjs";

export default function Counter() {
  const { amount, incrementCounter } = useAppState();
  const [isIncrementing, setIsIncrementing] = useState(false);
  const { isSignedIn } = useUser();

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
      {isSignedIn ? (
        <Button
          size="lg"
          onClick={handleClick}
          disabled={isIncrementing}
          className="bg-[url(/wood.webp)] bg-cover bg-center text-white"
        >
          Wypłaszcz
        </Button>
      ) : (
        "Zaloguj się, by wypłaszczyć"
      )}
    </>
  );
}

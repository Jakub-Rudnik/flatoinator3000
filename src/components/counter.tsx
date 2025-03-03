"use client";

import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { pusherClient } from "@/lib/pusher";

type CounterProps = {
  initialAmount: number;
};

export default function Counter({ initialAmount }: CounterProps) {
  const [amount, setAmount] = useState(initialAmount);

  useEffect(() => {
    const channel = pusherClient.subscribe("counter-channel");

    channel.bind("counter-update", (data: { amount: number }) => {
      setAmount(data.amount);
    });

    return () => {
      pusherClient.unsubscribe("counter-channel");
    };
  }, []);

  const handleClick = async () => {
    try {
      const response = await fetch("/api/socket", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ action: "increment" }),
      });

      // The UI will update via Pusher
    } catch (error) {
      console.error("Failed to increment:", error);
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
        className="bg-[url(/wood.webp)] bg-cover bg-center text-white"
      >
        Wypłaszcz
      </Button>
    </>
  );
}

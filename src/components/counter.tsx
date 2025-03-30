"use client";

import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { SignInButton, useUser } from "@clerk/nextjs";
import type { click, counter } from "@/server/db/schema";
import { pusherClient } from "@/lib/pusher";

export default function Counter({ counter, initialClicks }: { counter: counter, initialClicks: number }) {
  const [isIncrementing, setIsIncrementing] = useState(false);
  const [amount, setAmount] = useState(initialClicks);
  const { isSignedIn } = useUser();

  useEffect(() => {
    const channel = pusherClient.subscribe(`counter-${counter.id}`);

    function updateState(data: { action: string }) {
      if (data.action === "update") {
        setAmount(prev => prev + 1);
      }
    }

    channel.bind('update', updateState);

    return () => {
      channel.unbind('update', updateState);
      pusherClient.unsubscribe(`counter-${counter.id}`);
    };
  }, []);

  const handleClick = async () => {
    if (isIncrementing) return;
    setIsIncrementing(true);
    try {
      await incrementCounter();
    } finally {
      setIsIncrementing(false);
    }
  };

  const incrementCounter = async () => {
    try {
      const response = await fetch("/api/socket", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ counterId: counter.id }),
        cache: "no-store",
      });

      if (!response.ok) {
        console.error("Server error:", await response.text());
      }
    } catch (error) {
      console.error("Failed to increment:", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center gap-5 py-10">
      <p className="text-center text-sm text-muted-foreground">
        {counter.name}
      </p>
      <h1 className="scroll-m-20 text-center text-4xl font-extrabold tracking-tight lg:text-5xl">
        {counter.description}
      </h1>
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
          {counter.buttonText}
        </Button>
      ) : (
        <SignInButton mode="modal">
          <Button size="lg" >
            Zaloguj się</Button>
        </SignInButton>
      )}
    </div>
  );
}

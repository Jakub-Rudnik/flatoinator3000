// src/lib/counter-context.tsx
"use client";

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { pusherClient } from "@/lib/pusher";

interface CounterContextType {
  amount: number;
  incrementCounter: () => Promise<void>;
}

const CounterContext = createContext<CounterContextType | null>(null);

export function CounterProvider({
  children,
  initialAmount,
}: {
  children: ReactNode;
  initialAmount: number;
}) {
  const [amount, setAmount] = useState(initialAmount);

  useEffect(() => {
    const channel = pusherClient.subscribe("counter-channel");

    function updateCounter(data: { amount: number }) {
      setAmount(data.amount);
    }

    channel.bind("counter-update", updateCounter);

    return () => {
      channel.unbind("counter-update", updateCounter);
      pusherClient.unsubscribe("counter-channel");
    };
  }, []);

  const incrementCounter = async () => {
    try {
      const response = await fetch("/api/socket", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ action: "increment" }),
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
    <CounterContext.Provider value={{ amount, incrementCounter }}>
      {children}
    </CounterContext.Provider>
  );
}

export function useCounter() {
  const context = useContext(CounterContext);
  if (!context) {
    throw new Error("useCounter must be used within a CounterProvider");
  }
  return context;
}

// src/lib/counter-context.tsx
"use client";

import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { pusherClient } from "@/lib/pusher";

interface CounterContextType {
  amount: number;
  debouncedIncrement: () => void;
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

  function clientDebounce<T extends (...args: never[]) => void>(
    fn: T,
    delay: number,
  ): (...args: Parameters<T>) => void {
    let timeoutId: NodeJS.Timeout;
    return (...args: Parameters<T>) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => fn(...args), delay);
    };
  }

  // lib/counter-context.tsx
  const incrementCounter = async () => {
    // Optimistic update - immediately update the UI
    setAmount((prev) => prev + 1);

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
        // Revert on error
        setAmount((prev) => prev - 1);
        console.error("Server error:", await response.text());
      }
    } catch (error) {
      // Revert on error
      setAmount((prev) => prev - 1);
      console.error("Failed to increment:", error);
    }
  };

  const incrementCounterRef = useRef(incrementCounter);
  useEffect(() => {
    incrementCounterRef.current = incrementCounter;
  }, []);

  // Create a debounced version that always uses the current implementation
  const debouncedIncrement = useCallback(() => {
    const debouncedFn = clientDebounce(async () => {
      await incrementCounterRef.current();
    }, 200);
    debouncedFn();
  }, []);

  return (
    <CounterContext.Provider value={{ amount, debouncedIncrement }}>
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

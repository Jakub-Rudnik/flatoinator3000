"use client";

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { pusherClient } from "@/lib/pusher";
import type { click } from "@/server/db/schema";

interface StateContextType {
  amount: number;
  clicks: click[];
  incrementCounter: () => Promise<void>;
}

const StateContext = createContext<StateContextType | null>(null);

export function StateProvider({
  children,
  initialClicks,
}: {
  children: ReactNode;
  initialClicks: click[];
}) {
  const [amount, setAmount] = useState(initialClicks.length);
  const [clicks, setClicks] = useState<click[]>(initialClicks);

  useEffect(() => {
    const channel = pusherClient.subscribe("state-channel");

    function updateState(data: { amount: number; clicks: click[] }) {
      setAmount(data.amount);
      setClicks(data.clicks);
    }

    channel.bind("state-update", updateState);

    return () => {
      channel.unbind("state-update", updateState);
      pusherClient.unsubscribe("state-channel");
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
    <StateContext.Provider value={{ amount, clicks, incrementCounter }}>
      {children}
    </StateContext.Provider>
  );
}

export function useAppState() {
  const context = useContext(StateContext);
  if (!context) {
    throw new Error("useAppState must be used within a StateProvider");
  }
  return context;
}

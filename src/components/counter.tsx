"use client";

import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { SignInButton, useUser } from "@clerk/nextjs";
import { Doc, Id } from "convex/_generated/dataModel";
import { Preloaded, useMutation, usePreloadedQuery, useQuery } from "convex/react";
import { api } from "convex/_generated/api";

export type CounterWithClick = Doc<"counters"> & {
  clicks: Preloaded<typeof api.clicks.getTodaysClicks>;
};

interface CounterProps {
  counterData: CounterWithClick;
}

export default function Counter({ counterData }: CounterProps) {
  const { isSignedIn, isLoaded } = useUser();
  const { _id, name, description, buttonText } = counterData;
  const clicks = usePreloadedQuery(counterData.clicks);
  const mutateClicks = useMutation(api.clicks.addClick);

  function handleClick() {
    if (isSignedIn) {
      mutateClicks({ counterId: _id });
    }
  }


  return (
    <div className="flex flex-col items-center justify-center gap-5 py-10">
      <p className="text-center text-sm text-muted-foreground">
        {name}
      </p>
      <h2 className="scroll-m-20 text-center text-xl font-extrabold tracking-tight lg:text-2xl">
        {description}
      </h2>
      <h3 className="scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0">
        {clicks ? clicks.length : 0}
      </h3>
      {isSignedIn && isLoaded && (
        <Button
          onClick={() => handleClick()}
          size="lg"
          className="bg-[url(/wood.webp)] bg-cover bg-center text-white"
        >
          {buttonText}
        </Button>
      )}
    </div>
  );
}

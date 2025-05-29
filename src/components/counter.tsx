"use client";

import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { SignInButton, useUser } from "@clerk/nextjs";
import { Doc, Id } from "convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import { api } from "convex/_generated/api";

export type CounterWithClick = Doc<"counters"> & {
  clicks: number;
}

interface CounterProps {
  _id: Id<"counters">;
  name: string;
  description: string;
  buttonText: string;
}

export default function Counter({ _id, name, description, buttonText }: CounterProps) {
  const { isSignedIn } = useUser();
  const clicks = useQuery(api.clicks.getTodaysClicks, { counterId: _id });
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
      <h1 className="scroll-m-20 text-center text-4xl font-extrabold tracking-tight lg:text-5xl">
        {description}
      </h1>
      <h2 className="scroll-m-20 pb-2 text-5xl font-semibold tracking-tight first:mt-0">
        {clicks ? clicks.length : 0}
      </h2>
      {isSignedIn ? (
        <Button
          onClick={() => handleClick()}
          size="lg"
          className="bg-[url(/wood.webp)] bg-cover bg-center text-white"
        >
          {buttonText}
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

"use client";

import { useQuery } from "@tanstack/react-query";
import { trpcClient } from "~/integration/trpc/client.trpc";

export function TestComponent() {
  const { data, isPending, error } = useQuery(
    trpcClient.index.greeting.queryOptions({ name: "Sain-Biswas" })
  );

  if (isPending) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error.message}</div>;
  }

  return <div>{data.message}</div>;
}

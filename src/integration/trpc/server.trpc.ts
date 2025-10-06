import "server-only";

import { headers } from "next/headers";
import { cache } from "react";

import { createTRPCOptionsProxy } from "@trpc/tanstack-react-query";
import { createTRPCContext } from "~/server/api/index.trpc";
import { appRouter, createCaller } from "~/server/api/root.trpc";
import { getQueryClient } from "../tanstack-query/query-client";

/**
 * This wraps the `createTRPCContext` helper and provides the required context for the tRPC API when
 * handling a tRPC call from a React Server Component.
 */
const createContext = cache(async () => {
  const heads = new Headers(await headers());
  heads.set("x-trpc-source", "rsc");

  return createTRPCContext({
    headers: heads
  });
});

const queryClient = cache(getQueryClient);

export const trpcServerOptions = createTRPCOptionsProxy({
  ctx: createContext,
  router: appRouter,
  queryClient
});

export const trpcServer = createCaller(createContext);

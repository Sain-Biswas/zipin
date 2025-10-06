import {
  createTRPCClient,
  httpBatchStreamLink,
  loggerLink
} from "@trpc/client";
import type { inferRouterInputs, inferRouterOutputs } from "@trpc/server";
import { createTRPCOptionsProxy } from "@trpc/tanstack-react-query";
import SuperJSON from "superjson";

import { env } from "~/env";
import { getQueryClient } from "~/integration/tanstack-query/query-client";
import type { AppRouter } from "~/server/api/root.trpc";

/**
 * Inference helper for inputs.
 */
export type RouterInputs = inferRouterInputs<AppRouter>;

/**
 * Inference helper for outputs.
 */
export type RouterOutputs = inferRouterOutputs<AppRouter>;

const queryClient = getQueryClient();

const trpc = createTRPCClient<AppRouter>({
  links: [
    httpBatchStreamLink({
      transformer: SuperJSON,
      url: `${env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_PROTOCOL}${env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL}/api/trpc`,
      headers: () => {
        const headers = new Headers();
        headers.set("x-trpc-source", "nextjs-react");
        return headers;
      }
    }),
    loggerLink({
      enabled: (op) =>
        process.env.NODE_ENV === "development" ||
        (op.direction === "down" && op.result instanceof Error)
    })
  ]
});

export const trpcClient = createTRPCOptionsProxy<AppRouter>({
  client: trpc,
  queryClient
});

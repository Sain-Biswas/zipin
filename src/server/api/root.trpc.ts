import "server-only";

import { createCallerFactory, createTRPCRouter } from "~/server/api/index.trpc";
import { indexRouter } from "~/server/api/routes/index.route";

/**
 * This is the primary router for your server.
 *
 * All routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  index: indexRouter
});

/**
 * export type definition of API
 */
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 *
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.index.isWorking();
 *        ^? { message : string }
 */
export const createCaller = createCallerFactory(appRouter);

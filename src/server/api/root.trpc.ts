import "server-only";

import { createCallerFactory, createTRPCRouter } from "~/server/api/index.trpc";
import { authenticationRouter } from "~/server/api/routes/authentication.route";
import { indexRouter } from "~/server/api/routes/index.route";
import { linksRouter } from "~/server/api/routes/links.route";
import { statisticsRouter } from "~/server/api/routes/statistics.route";

/**
 * This is the primary router for your server.
 *
 * All routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  index: indexRouter,
  authentication: authenticationRouter,
  links: linksRouter,
  statistics: statisticsRouter
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

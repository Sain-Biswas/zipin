import "server-only";

import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure
} from "~/server/api/index.trpc";

export const indexRouter = createTRPCRouter({
  isWorking: publicProcedure.query(() => {
    return {
      message: "The server is up and running."
    };
  }),

  greeting: publicProcedure
    .input(z.object({ name: z.string() }))
    .query(({ input }) => ({
      message: `Hello from ${input.name}`
    })),

  isAuthenticated: protectedProcedure.query(({ ctx }) => ({
    message: `${ctx.user.name} is authenticated.`
  }))
});

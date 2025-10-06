import "server-only";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure
} from "~/server/api/index.trpc";

export const authenticationRouter = createTRPCRouter({
  isAuthenticated: publicProcedure.query(({ ctx }) => {
    if (ctx.session?.user) {
      return {
        success: true,
        user: ctx.session.user
      } as const;
    }

    return {
      success: false,
      user: null
    } as const;
  }),

  getCurrentUser: protectedProcedure.query(({ ctx }) => ({ user: ctx.user }))
});

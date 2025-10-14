import { TRPCError } from "@trpc/server";
import { and, eq } from "drizzle-orm";
import "server-only";

import { z } from "zod";
import { slugify } from "~/lib/normalize-alphanumeric-string";

import { createTRPCRouter, protectedProcedure } from "~/server/api/index.trpc";
import {
  tagsSchema,
  urlSchema,
  urlToTagsSchema
} from "~/server/database/index.schema";

export const linksRouter = createTRPCRouter({
  createNewLink: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        originalUrl: z.url(),
        description: z.string(),
        folderId: z.uuid(),
        tags: z.array(z.string()),
        expiresOn: z.date().nullable(),
        utm: z
          .object({
            source: z.string().nullable(),
            medium: z.string().nullable(),
            campaign: z.string().nullable(),
            term: z.string().nullable(),
            content: z.string().nullable()
          })
          .nullable()
      })
    )
    .mutation(async ({ input, ctx }) => {
      const checkUrlId = await ctx.database.query.urlSchema.findFirst({
        where: eq(urlSchema.id, input.id)
      });

      if (!!checkUrlId) {
        throw new TRPCError({
          code: "CONFLICT",
          message:
            "This url is already taken. Please try some other combination or use the generator given."
        });
      }

      await ctx.database.transaction(async (tx) => {
        const newUrl = await tx
          .insert(urlSchema)
          .values({
            id: input.id,
            userId: ctx.user.id,
            originalUrl: input.originalUrl,
            description: input.description,
            expiresOn: input.expiresOn,
            folderId: input.folderId,
            isActive: true,
            utm: input.utm
          })
          .returning({ id: urlSchema.id });

        await tx.insert(urlToTagsSchema).values(
          input.tags.map((tag) => ({
            urlId: newUrl[0]?.id ?? "",
            tagsId: tag
          }))
        );
      });
    }),

  createNewTag: protectedProcedure
    .input(z.object({ name: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const normalized = slugify(input.name);

      const existing = await ctx.database.query.tagsSchema.findFirst({
        where: and(
          eq(tagsSchema.normalized, normalized),
          eq(tagsSchema.name, input.name)
        )
      });

      if (!!existing)
        throw new TRPCError({ code: "CONFLICT", message: existing.name });

      const newTag = await ctx.database
        .insert(tagsSchema)
        .values({
          name: input.name,
          normalized,
          userId: ctx.user.id
        })
        .returning();

      return newTag[0];
    })
});

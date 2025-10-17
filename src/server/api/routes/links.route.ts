import "server-only";

import { TRPCError } from "@trpc/server";
import { and, eq, or } from "drizzle-orm";

import { slugify } from "~/lib/normalize-alphanumeric-string";
import { createTRPCRouter, protectedProcedure } from "~/server/api/index.trpc";
import {
  folderSchema,
  tagsSchema,
  urlSchema,
  urlToTagsSchema
} from "~/server/database/index.schema";
import {
  createNewFolderSchema,
  createNewLinkSchema,
  nameSchema
} from "~/validators/trpc/links.validator";
import { folderSlugSchema } from "~/validators/trpc/statistics.validator";

export const linksRouter = createTRPCRouter({
  createNewLink: protectedProcedure
    .input(createNewLinkSchema)
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
    .input(nameSchema)
    .mutation(async ({ ctx, input }) => {
      const normalized = slugify(input.name);

      const existing = await ctx.database.query.tagsSchema.findFirst({
        where: and(
          or(
            eq(tagsSchema.normalized, normalized),
            eq(tagsSchema.name, input.name)
          ),
          eq(tagsSchema.userId, ctx.user.id)
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
    }),

  getAvailableTags: protectedProcedure.query(async ({ ctx }) => {
    const tags = await ctx.database.query.tagsSchema.findMany({
      where: eq(tagsSchema.userId, ctx.user.id)
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    return tags.map(({ userId, ...tag }) => tag);
  }),

  createNewFolder: protectedProcedure
    .input(createNewFolderSchema)
    .mutation(async ({ ctx, input }) => {
      const normalized = slugify(input.name);

      const existing = await ctx.database.query.folderSchema.findFirst({
        where: and(
          or(
            eq(folderSchema.normalized, normalized),
            eq(folderSchema.name, input.name)
          ),
          eq(folderSchema.userId, ctx.user.id)
        )
      });

      if (!!existing)
        throw new TRPCError({ code: "CONFLICT", message: existing.name });

      await ctx.database.insert(folderSchema).values({
        ...input,
        normalized,
        userId: ctx.user.id
      });
    }),

  getAvailableFolder: protectedProcedure.query(async ({ ctx }) => {
    const folders = await ctx.database.query.folderSchema.findMany({
      where: eq(folderSchema.userId, ctx.user.id)
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    return folders.map(({ userId, ...folder }) => folder);
  }),

  getFolderWithLinks: protectedProcedure
    .input(folderSlugSchema)
    .query(async ({ ctx, input }) => {
      const folder = await ctx.database.query.folderSchema.findFirst({
        where: and(
          eq(folderSchema.userId, ctx.user.id),
          eq(folderSchema.normalized, input.folderSlug)
        ),
        with: {
          urls: {
            with: {
              tags: {
                with: {
                  tags: true
                }
              }
            },
            extras: (urls, { sql }) => ({
              clickCount:
                sql<number>`(SELECT COUNT(*) FROM clicks c WHERE c.url_id = ${urls.id})`.as(
                  "click_count"
                )
            })
          }
        }
      });

      if (!folder)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Requested folder is not available in records."
        });

      return {
        id: folder.id,
        name: folder.name,
        normalized: folder.normalized,
        isUTM: folder.isUTM ?? false,
        utm:
          folder.isUTM ?
            {
              source: folder.isSourceEnabled,
              medium: folder.isMediumEnabled,
              campaign: folder.isCampaignEnabled,
              term: folder.isTermEnabled,
              content: folder.isContentEnabled
            }
          : null,
        createdOn: folder.createdAt,
        lastUpdatedOn: folder.updatedAt,
        urls: folder.urls.map((url) => ({
          id: url.id,
          originalURL: url.originalUrl,
          description: url.description,
          isActive: url.isActive,
          utm: url.utm,
          clickCount: url.clickCount,
          createdOn: url.createdOn,
          expiresOn: url.expiresOn,
          tags: url.tags.map((t) => ({
            id: t.tags.id,
            name: t.tags.name,
            normalized: t.tags.normalized
          }))
        }))
      };
    })
});

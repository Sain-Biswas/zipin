import "server-only";
import { createTRPCRouter, protectedProcedure } from "../index.trpc";

import { TRPCError } from "@trpc/server";
import { and, eq, sql } from "drizzle-orm";
import { z } from "zod";
import {
  clicksSchema,
  folderSchema,
  urlSchema
} from "~/server/database/index.schema";

export const statisticsRouter = createTRPCRouter({
  getFolderUTMStatistics: protectedProcedure
    .input(z.object({ folderSlug: z.string() }))
    .query(async ({ ctx, input }) => {
      const folder = await ctx.database.query.folderSchema.findFirst({
        where: and(
          eq(folderSchema.normalized, input.folderSlug),
          eq(folderSchema.userId, ctx.user.id)
        )
      });

      if (!folder)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Requested folder doesn't exist."
        });

      const [source, medium, campaign, term, content] = await Promise.all([
        ctx.database
          .select({
            source:
              sql<string>`COALESCE(url.utm->>'source', 'Uncategorised')`.as(
                "source"
              ),
            clicksCount: sql<number>`COUNT(${clicksSchema.urlId})`.as(
              "clicks_count"
            )
          })
          .from(clicksSchema)
          .innerJoin(urlSchema, eq(clicksSchema.urlId, urlSchema.id))
          .where(eq(urlSchema.folderId, folder.id))
          .groupBy(sql`COALESCE(url.utm->>'source', 'Uncategorised')`)
          .orderBy(sql`COUNT(${clicksSchema.urlId}) DESC`),

        ctx.database
          .select({
            medium:
              sql<string>`COALESCE(url.utm->>'medium', 'Uncategorised')`.as(
                "medium"
              ),
            clicksCount: sql<number>`COUNT(${clicksSchema.urlId})`.as(
              "clicks_count"
            )
          })
          .from(clicksSchema)
          .innerJoin(urlSchema, eq(clicksSchema.urlId, urlSchema.id))
          .where(eq(urlSchema.folderId, folder.id))
          .groupBy(sql`COALESCE(url.utm->>'medium', 'Uncategorised')`)
          .orderBy(sql`COUNT(${clicksSchema.urlId}) DESC`),

        ctx.database
          .select({
            campaign:
              sql<string>`COALESCE(url.utm->>'campaign', 'Uncategorised')`.as(
                "campaign"
              ),
            clicksCount: sql<number>`COUNT(${clicksSchema.urlId})`.as(
              "clicks_count"
            )
          })
          .from(clicksSchema)
          .innerJoin(urlSchema, eq(clicksSchema.urlId, urlSchema.id))
          .where(eq(urlSchema.folderId, folder.id))
          .groupBy(sql`COALESCE(url.utm->>'campaign', 'Uncategorised')`)
          .orderBy(sql`COUNT(${clicksSchema.urlId}) DESC`),

        ctx.database
          .select({
            term: sql<string>`COALESCE(url.utm->>'term', 'Uncategorised')`.as(
              "term"
            ),
            clicksCount: sql<number>`COUNT(${clicksSchema.urlId})`.as(
              "clicks_count"
            )
          })
          .from(clicksSchema)
          .innerJoin(urlSchema, eq(clicksSchema.urlId, urlSchema.id))
          .where(eq(urlSchema.folderId, folder.id))
          .groupBy(sql`COALESCE(url.utm->>'term', 'Uncategorised')`)
          .orderBy(sql`COUNT(${clicksSchema.urlId}) DESC`),

        ctx.database
          .select({
            content:
              sql<string>`COALESCE(url.utm->>'content', 'Uncategorised')`.as(
                "content"
              ),
            clicksCount: sql<number>`COUNT(${clicksSchema.urlId})`.as(
              "clicks_count"
            )
          })
          .from(clicksSchema)
          .innerJoin(urlSchema, eq(clicksSchema.urlId, urlSchema.id))
          .where(eq(urlSchema.folderId, folder.id))
          .groupBy(sql`COALESCE(url.utm->>'content', 'Uncategorised')`)
          .orderBy(sql`COUNT(${clicksSchema.urlId}) DESC`)
      ]);

      const utm =
        folder.isUTM ?
          {
            source: folder.isSourceEnabled,
            medium: folder.isMediumEnabled,
            campaign: folder.isCampaignEnabled,
            term: folder.isTermEnabled,
            content: folder.isContentEnabled
          }
        : null;

      return { source, medium, campaign, term, content, utm };
    })
});

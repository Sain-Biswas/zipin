import { relations } from "drizzle-orm";
import { boolean, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { urlSchema } from "./url.schema";
import { userSchema } from "./user.schema";

export const folderSchema = pgTable("folder", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name").notNull(),
  normalized: text("normalized").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  isUTM: boolean("is_utm").default(false),
  userId: text("user_id")
    .notNull()
    .references(() => userSchema.id),

  isSourceEnabled: boolean("is_source_enabled").notNull(),
  isMediumEnabled: boolean("is_medium_enabled").notNull(),
  isCampaignEnabled: boolean("is_campaign_enabled").notNull(),
  isTermEnabled: boolean("is_term_enabled").notNull(),
  isContentEnabled: boolean("is_content_enabled").notNull(),

  updatedAt: timestamp("updated_at")
    .defaultNow()
    .notNull()
    .$onUpdateFn(() => new Date())
});

export const folderRelation = relations(folderSchema, ({ many, one }) => ({
  urls: many(urlSchema, { relationName: "url--folder" }),
  user: one(userSchema, {
    fields: [folderSchema.userId],
    references: [userSchema.id],
    relationName: "folders---user"
  })
}));

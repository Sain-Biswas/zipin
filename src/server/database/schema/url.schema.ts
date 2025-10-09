import { relations } from "drizzle-orm";
import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { tagsSchema } from "./tags.schema";
import { userSchema } from "./user.schema";

export const urlSchema = pgTable("url", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => userSchema.id),
  originalUrl: text("original_url").notNull(),
  description: text("description"),
  createdOn: timestamp("created_on").defaultNow().notNull(),
  expiresOn: timestamp("expires_on")
});

export const urlToTagsSchema = pgTable("url_to_tags", {
  urlId: text("url_id")
    .notNull()
    .references(() => urlSchema.id),
  tagsId: text("tags_id")
    .notNull()
    .references(() => tagsSchema.id)
});

export const urlToTagsRelation = relations(urlToTagsSchema, ({ one }) => ({
  url: one(urlSchema, {
    fields: [urlToTagsSchema.urlId],
    references: [urlSchema.id],
    relationName: "url_to_tags--url"
  }),
  tags: one(tagsSchema, {
    fields: [urlToTagsSchema.tagsId],
    references: [tagsSchema.id],
    relationName: "url_to_tags--tags"
  })
}));

export const urlRelation = relations(urlSchema, ({ many }) => ({
  tags: many(urlToTagsSchema, { relationName: "url_to_tags--tags" })
}));

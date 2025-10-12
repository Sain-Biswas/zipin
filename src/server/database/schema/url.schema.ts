import { relations } from "drizzle-orm";
import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { folderSchema } from "./folders.schema";
import { tagsSchema } from "./tags.schema";
import { userSchema } from "./user.schema";

export const urlSchema = pgTable("url", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => userSchema.id, { onDelete: "cascade" }),
  originalUrl: text("original_url").notNull(),
  description: text("description"),
  createdOn: timestamp("created_on").defaultNow().notNull(),
  expiresOn: timestamp("expires_on"),
  folderId: text("folder_id").references(() => folderSchema.id, {
    onDelete: "cascade"
  })
});

export const urlToTagsSchema = pgTable("url_to_tags", {
  urlId: text("url_id")
    .notNull()
    .references(() => urlSchema.id, { onDelete: "cascade" }),
  tagsId: text("tags_id")
    .notNull()
    .references(() => tagsSchema.id, { onDelete: "cascade" })
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

export const urlRelation = relations(urlSchema, ({ many, one }) => ({
  tags: many(urlToTagsSchema, { relationName: "url_to_tags--tags" }),
  folder: one(folderSchema, {
    fields: [urlSchema.folderId],
    references: [folderSchema.id],
    relationName: "url--folder"
  })
}));

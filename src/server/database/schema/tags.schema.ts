import { relations } from "drizzle-orm";
import { pgTable, text } from "drizzle-orm/pg-core";
import { urlToTagsSchema } from "./url.schema";
import { userSchema } from "./user.schema";

export const tagsSchema = pgTable("tags", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name").notNull(),
  normalized: text("normalized").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => userSchema.id, { onDelete: "cascade" })
});

export const tagsRelation = relations(tagsSchema, ({ many }) => ({
  url: many(urlToTagsSchema, { relationName: "url_to_tags--url" })
}));

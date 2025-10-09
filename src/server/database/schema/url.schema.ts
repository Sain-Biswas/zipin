import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { userSchema } from "./user.schema";

export const urlSchema = pgTable("url", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => userSchema.id),
  originalUrl: text("original_url").notNull(),
  description: text("description"),
  createdOn: timestamp("created_on").defaultNow().notNull()
});

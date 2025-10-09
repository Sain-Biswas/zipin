import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { urlSchema } from "./url.schema";

export const clicksSchema = pgTable("clicks", {
  urlId: text("url_id")
    .notNull()
    .references(() => urlSchema.id),
  origin: text("origin").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull()
});

import { pgTable, text } from "drizzle-orm/pg-core";
import { userSchema } from "./user.schema";

export const tagsSchema = pgTable("tags", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => userSchema.id)
});

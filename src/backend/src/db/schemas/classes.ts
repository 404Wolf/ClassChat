import { integer, pgTable, varchar } from "drizzle-orm/pg-core";
import { users } from "./users";

export const classes = pgTable("classes", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  description: varchar({ length: 255 }).notNull(),
  members: integer().references(() => users.id),
});

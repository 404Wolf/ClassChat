import { integer, pgTable, uuid, varchar } from "drizzle-orm/pg-core";
import { users } from "./users";

export const classes = pgTable("classes", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  uuid: uuid().notNull().unique(),
  name: varchar({ length: 255 }).notNull(),
  description: varchar({ length: 255 }),
  members: integer().references(() => users.id),
});

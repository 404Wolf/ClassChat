import {
  boolean,
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  varchar,
  type AnyPgColumn,
} from "drizzle-orm/pg-core";
import { users } from "./users";
import { classes } from "./classes";

export const senderType = pgEnum("sender_type", ["user", "bot"]);

export const senders = pgTable("senders", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  userId: integer().references(() => users.id),
  role: senderType().notNull(),
});

export const chats = pgTable("chats", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  classId: integer().references((): AnyPgColumn => classes.id),
  name: varchar({ length: 100 }).notNull(),
  description: text(),
  hasAi: boolean(),
  members: integer()
    .references((): AnyPgColumn => users.id)
    .array(),
});

export const message = pgTable("messages", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  chatId: integer()
    .notNull()
    .references(() => chats.id),
  senderId: integer()
    .notNull()
    .references(() => senders.id),
  repliesTo: integer().references((): AnyPgColumn => message.id),
  message: varchar({ length: 255 }).notNull(),
  prompt: varchar({ length: 255 }),
  tokens: integer().default(0),
  sentAt: timestamp().notNull(),
  createdAt: timestamp().defaultNow(),
});

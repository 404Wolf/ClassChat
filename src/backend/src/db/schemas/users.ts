import { integer, pgTable, timestamp, varchar } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }),
  email: varchar({ length: 255 }).notNull().unique(),
  emailVerified: timestamp(),
  imageUrl: varchar({ length: 255 }),
  createdAt: timestamp().defaultNow(),
});

export const accounts = pgTable("accounts", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  userId: integer()
    .notNull()
    .references(() => users.id),
  provider: varchar({ length: 255 }).notNull(),
  providerAccountId: varchar({ length: 255 }).notNull().unique(),
  accessToken: varchar({ length: 255 }),
  refreshToken: varchar({ length: 255 }),
  expiresAt: timestamp(),
  createdAt: timestamp().defaultNow(),
});

export const sessions = pgTable("sessions", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  sessionToken: varchar({ length: 255 }).notNull().unique(),
  userId: integer()
    .notNull()
    .references(() => users.id),
  expires: timestamp().notNull(),
});

export const verificationTokens = pgTable("verification_tokens", {
  identifier: varchar({ length: 255 }).notNull(),
  token: varchar({ length: 255 }).notNull().unique(),
  expires: timestamp().notNull(),
});

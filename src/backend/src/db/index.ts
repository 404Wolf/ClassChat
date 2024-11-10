import { drizzle } from "drizzle-orm/postgres-js";

export const DATABASE_URL = `postgresql://${process.env.POSTGRES_USER}:${process.env.POSTGRES_PASSWORD}@db:5432/${process.env.POSTGRES_DB}`;
console.log(DATABASE_URL);

export const db = drizzle(DATABASE_URL);

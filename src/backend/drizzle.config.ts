import "dotenv/config";
import { defineConfig } from "drizzle-kit";
import { DATABASE_URL } from "~/db";

export default defineConfig({
  out: "./drizzle",
  schema: "./src/db/schemas",
  dialect: "postgresql",
  dbCredentials: {
    url: DATABASE_URL,
  },
});

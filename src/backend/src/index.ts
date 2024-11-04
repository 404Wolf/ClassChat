import { Hono } from "hono";
import { cors } from "hono/cors";
import { trpcServer } from "@hono/trpc-server";
import { appRouter } from "./trpc/routers";
import type { AppRouter } from "./trpc/routers";

const app = new Hono();

app.use("/trpc/*", cors());
app.use(
  "/trpc/*",
  trpcServer({
    router: appRouter,
  }),
);

export default app;
export type { AppRouter };

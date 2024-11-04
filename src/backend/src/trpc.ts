import { initTRPC } from "@trpc/server";
import { z } from "zod";
import redis from "@/db/redis";

const t = initTRPC.create();

const publicProcedure = t.procedure;
const router = t.router;

export const appRouter = router({
  hello: publicProcedure
    .input(z.string().nullish())
    .query(async ({ input }) => {
      const helloCount = await redis.get("hello-count");
      console.log("helloCount", helloCount);
      if (helloCount === null) {
        redis.set("hello-count", 1);
      } else {
        redis.set("hello-count", parseInt(helloCount) + 1);
      }
      return `Hello, ${input ?? "world"} (x${helloCount ?? 0})`;
    }),
});

export type AppRouter = typeof appRouter;

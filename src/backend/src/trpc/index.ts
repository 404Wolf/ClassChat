import { initTRPC } from "@trpc/server";
import { v4 as uuid } from "uuid";

type Context = { id: string };
export const t = initTRPC.context<Context>().create();

const router = t.router;

const publicProcedure = t.procedure.use(
  t.middleware(({ ctx, next }) => {
    return next({
      ctx: {
        ...ctx,
        id: uuid(),
      },
    });
  }),
);

export { router, publicProcedure };

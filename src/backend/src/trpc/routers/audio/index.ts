import { router, publicProcedure } from "../..";
import { z } from "zod";

export const audioRouter = router({
  sendChunk: publicProcedure
    .input(z.object({ b64: z.string() }))
    .mutation(({ input }) => {
      console.log("Received chunk", input.b64);
    }),
  getAudioStatus: publicProcedure.query(() => {
    return "Placeholder";
  }),
});

export type AppRouter = typeof audioRouter;

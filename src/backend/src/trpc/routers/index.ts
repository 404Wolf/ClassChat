import { router } from "../";
import { audioRouter } from "./audio";

export const appRouter = router({
  audio: audioRouter,
});

export type AppRouter = typeof appRouter;

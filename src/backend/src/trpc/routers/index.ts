import { router } from "..";
import { audioRouter } from "./audio";
import { chatRouter } from "./chat";

export const appRouter = router({
  audio: audioRouter,
  chat: chatRouter,
});

export type AppRouter = typeof appRouter;

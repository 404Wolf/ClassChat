import { router } from "..";
import { audioRouter } from "./audio";
import { chatsRouter } from "./chats";
import { classesRouter } from "./classes";
import { usersRouter } from "./users";

export const appRouter = router({
  audio: audioRouter,
  chats: chatsRouter,
  classes: classesRouter,
  users: usersRouter,
});

export type AppRouter = typeof appRouter;

import { router, publicProcedure } from "../..";
import { z } from "zod";
import { queryWithTranscription } from "./queries";
import { eq } from "drizzle-orm";
import { db } from "../../../db";
import { transcriptions } from "../../../db/schemas/audio";
import { chats } from "../../../db/schemas/chats";

export const chatsRouter = router({
  respondToMessage: publicProcedure
    .input(
      z.object({
        query: z.string(),
        history: z.array(z.string().refine((value) => value.length > 0)),
        classId: z.number().int(),
      }),
    )
    .output(z.string())
    .query(async ({ input }) => {
      const { query, classId } = input;

      const transcription = await db
        .select({ transcription: transcriptions.transcription })
        .from(transcriptions)
        .where(eq(transcriptions.classId, classId))
        .limit(1)
        .execute();
      const transcriptionText = transcription[0]?.transcription;
      if (!transcriptionText) {
        throw new Error("Transcription not found");
      }

      return await queryWithTranscription(query, transcriptionText);
    }),
  sendChatMessage: publicProcedure
    .input(
      z.object({
        classId: z.number().int(),
        messages: z.array(
          z.object({
            role: z.string(),
            content: z.string(),
          }),
        ),
      }),
    )
    .output(z.boolean())
    .mutation(async ({ input }) => {
      const { messages, classId } = input;
      const history = messages.map((message) => message.content);

      const status = await db
        .update(transcriptions)
        .set({ transcription: history.join(" ") })
        .where(eq(transcriptions.classId, classId))
        .execute();

      return status.length !== 0;
    }),
  getChat: publicProcedure
    .input(z.object({ classId: z.number().int() }))
    .output(
      z.object({
        messages: z.array(
          z.object({
            role: z.union([z.literal("user"), z.literal("assistant")]),
            content: z.string(),
          }),
        ),
      }),
    )
    .query(async ({ input }) => {
      const { classId } = input;

      const chatHistory = await db
        .select({
          chatId: chats.id,
          name: chats.name,
          description: chats.description,
          hasAi: chats.hasAi,
          members: chats.members,
        })
        .from(transcriptions)
        .where(eq(chats.classId, classId));

      const messages = history ? JSON.parse(history) : [];
      return { messages };
    }),
});

export type AppRouter = typeof chatsRouter;

import { router, publicProcedure } from "../..";
import { z } from "zod";
import redis from "~/db/redis";
import { transcribeAudio } from "./transcriptions";
import { db } from "~/db";
import { transcriptions } from "~/db/schemas/audio";
import { eq } from "drizzle-orm";

export const audioRouter = router({
  sendChunk: publicProcedure
    .input(z.object({ b64: z.string(), classId: z.number().int() }))
    .output(
      z.object({
        transcription: z.object({
          chunk: z.string(),
          whole: z.string(),
        }),
      }),
    )
    .mutation(async ({ input }) => {
      const { classId, b64 } = input;
      const transcriptionText = await transcribeAudio(b64);

      await redis.append(`class-rec:${classId}:audio_data`, b64);
      await db
        .update(transcriptions)
        .set({
          transcription: transcriptionText,
          transcriber: "openai_whisper",
        })
        .where(eq(transcriptions.classId, classId));

      const wholeTranscription = await db
        .select({ transcription: transcriptions.transcription })
        .from(transcriptions)
        .where(eq(transcriptions.classId, classId))
        .limit(1)
        .execute();

      if (
        wholeTranscription.length !== 1 ||
        !wholeTranscription[0].transcription
      ) {
        throw new Error("Transcription not found");
      }
      const wholeTranscriptionText = wholeTranscription[0].transcription;

      return {
        transcription: {
          chunk: transcriptionText,
          whole: wholeTranscriptionText,
        },
      };
    }),
  getTranscription: publicProcedure
    .input(z.object({ classId: z.string().uuid() }))
    .output(
      z.object({ transcription: z.string().optional(), found: z.boolean() }),
    )
    .query(async ({ input }) => {
      const { classId } = input;
      const transcription = await redis.get(
        `class-rec:${classId}:transcription`,
      );

      if (transcription) {
        return { transcription, found: true };
      }
      return { found: false };
    }),
});

export type AppRouter = typeof audioRouter;

import { router, publicProcedure } from "../..";
import { z } from "zod";
import redis from "~/db/redis";
import openai from "~/openai";
import { base64ToBlob } from "~/utils";

async function transcribeAudio(base64Audio: string): Promise<string> {
  const mimeType = "audio/wav";
  const blob = base64ToBlob(base64Audio, mimeType);
  const file = new File([blob], "audio-chunk", { type: mimeType });
  const response = await openai.audio.transcriptions.create({
    model: "whisper-1",
    file,
    language: "en",
  });

  return response.text;
}

export const audioRouter = router({
  sendChunk: publicProcedure
    .input(z.object({ b64: z.string(), classId: z.string().uuid() }))
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
      const transcription = await transcribeAudio(b64);

      await redis.append(`class-rec:${classId}:audio_data`, b64);
      await redis.append(`class-rec:${classId}:transcription`, transcription);

      const wholeTranscription =
        (await redis.get(`class-rec:${classId}:transcription`)) || "";

      return {
        transcription: { chunk: transcription, whole: wholeTranscription },
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
      return { found: true };
    }),
  hasTranscription: publicProcedure
    .input(z.object({ classId: z.string().uuid() }))
    .output(z.boolean())
    .query(async ({ input }) => {
      const { classId } = input;
      return !!(await redis.get(`class-rec:${classId}:transcription`));
    }),
});

export type AppRouter = typeof audioRouter;

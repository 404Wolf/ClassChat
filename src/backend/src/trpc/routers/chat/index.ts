import { router, publicProcedure } from "../..";
import { z } from "zod";
import redis from "~/db/redis";
import openai from "~/openai";

async function queryWithTranscription(query: string, transcription: string) {
  const messages: { role: "system" | "user" | "assistant"; content: string }[] =
    [
      {
        role: "system",
        content:
          "You are a helpful assistant. Use the provided context to answer questions accurately, relevantly, and concisely.",
      },
      {
        role: "user",
        content: `Context: ${transcription}\n\nQuestion: ${query}`,
      },
    ];

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages,
      temperature: 0.7,
      max_tokens: 500,
    });

    return (
      completion.choices[0]?.message?.content ||
      "Sorry, I couldn't generate a response."
    );
  } catch (error) {
    console.error("OpenAI API Error:", error);
    throw new Error("Failed to generate response");
  }
}

export const chatRouter = router({
  respondToMessage: publicProcedure
    .input(
      z.object({
        query: z.string(),
        history: z.array(z.string().refine((value) => value.length > 0)),
        classId: z.string().uuid(),
      }),
    )
    .output(
      z.object({
        response: z.string(),
      }),
    )
    .query(async ({ input }) => {
      const { query, classId } = input;

      // Get transcription from Redis
      const transcription = await redis.get(
        `class-rec:${classId}:transcription`,
      );

      if (!transcription) {
        throw new Error("Transcription not found");
      }

      // Call the queryWithTranscription function with the transcription
      const response = await queryWithTranscription(query, transcription);

      return { response };
    }),
});

export type AppRouter = typeof chatRouter;

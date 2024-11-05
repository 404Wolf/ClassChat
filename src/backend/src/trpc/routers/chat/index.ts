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
  saveChatHistory: publicProcedure
    .input(
      z.object({
        classId: z.string().uuid(),
        messages: z.array(
          z.object({
            role: z.string(),
            content: z.string(),
          }),
        ),
      }),
    )
    .mutation(async ({ input }) => {
      const { messages, classId } = input;
      const history = messages.map((message) => message.content);

      // Save chat history to Redis
      await redis.set(
        `class-rec:${classId}:chatHistory`,
        JSON.stringify(history),
      );
    }),
  getChatHistory: publicProcedure
    .input(z.object({ classId: z.string().uuid() }))
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
      const history = await redis.get(`class-rec:${classId}:chatHistory`);
      const messages = history ? JSON.parse(history) : [];
      return { messages };
    }),
});

export type AppRouter = typeof chatRouter;

import openai from "../../../openai";

export async function queryWithTranscription(
  callback: (chunk: string) => void,
  query: string,
  transcription: string,
  model = "gpt-4o",
) {
  const messages: { role: "system" | "user" | "assistant"; content: string }[] =
    [
      {
        role: "system",
        content:
          "You are a helpful assistant. Use the provided context to answer questions accurately, relevantly, and concisely." +
          "Be relatively concise and use the context for the response if it helps.",
      },
      {
        role: "user",
        content: `Context: ${transcription}\n\nQuestion: ${query}`,
      },
    ];

  try {
    const completion = await openai.chat.completions.create({
      model,
      messages,
      temperature: 0.7,
      max_tokens: 500,
      stream: true,
    });

    for await (const chunk of completion) {
      callback(chunk.choices[0]?.delta.content || "");
    }
  } catch (error) {
    console.error("OpenAI API Error:", error);
    throw new Error("Failed to generate response");
  }
}

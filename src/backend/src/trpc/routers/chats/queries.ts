import openai from "../../../openai";

export async function queryWithTranscription(
  query: string,
  transcription: string,
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
      model: "gpt-4o",
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

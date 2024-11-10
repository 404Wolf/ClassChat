import openai from "~/openai";
import { base64ToBlob } from "~/utils";

export async function transcribeAudio(base64Audio: string): Promise<string> {
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

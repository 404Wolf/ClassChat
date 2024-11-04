import type { MetaFunction } from "@remix-run/node";
import metadata from "~/meta";
import { useState, useRef } from "react";
import trpc from "../trpc";

export const meta: MetaFunction = () => {
  return [
    { title: metadata.name },
    { name: "description", content: metadata.description },
  ];
};

export default function Index() {
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorder = useRef(null);
  const audioChunks = useRef([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder.current = new MediaRecorder(stream);
      audioChunks.current = [];

      mediaRecorder.current.ondataavailable = (event) => {
        audioChunks.current.push(event.data);
      };

      mediaRecorder.current.onstop = async () => {
        const audioBlob = new Blob(audioChunks.current, { type: 'audio/webm' });
        const reader = new FileReader();

        reader.onloadend = async () => {
          const base64Audio = reader.result.split(',')[1];
          try {
            await trpc.audio.sendChunk.mutate({ b64: base64Audio });
          } catch (error) {
            console.error('Error sending audio:', error);
          }
        };

        reader.readAsDataURL(audioBlob);
      };

      mediaRecorder.current.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder.current && isRecording) {
      mediaRecorder.current.stop();
      mediaRecorder.current.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
    }
  };

  return (
    <div className="flex h-screen items-center justify-center">
      <button
        onClick={isRecording ? stopRecording : startRecording}
        className={`rounded-lg px-4 py-2 font-bold ${isRecording
            ? "bg-red-500 hover:bg-red-700 text-white"
            : "bg-blue-500 hover:bg-blue-700 text-white"
          }`}
      >
        {isRecording ? "Stop Recording" : "Start Recording"}
      </button>
    </div>
  );
}

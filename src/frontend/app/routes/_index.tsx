import { MetaFunction } from "@remix-run/node";
import metadata from "~/meta";
import { useCallback, useEffect } from "react";
import { useAudioTranscription } from "~/hooks/useAudioTranscription";
import { useClassId } from "~/hooks/useClassId";
import TranscriptionBox from "~/components/TranscriptionBox";
import ChattingBox from "~/components/ChattingBox";
import trpc from "~/trpc";

export const meta: MetaFunction = () => {
  return [
    { title: metadata.name },
    { name: "description", content: metadata.description },
  ];
};

export default function Index() {
  const { classId, resetClassId } = useClassId();
  const {
    transcription,
    isRecording,
    startRecording,
    stopRecording,
  } = useAudioTranscription({ classId: classId || "" });

  // Start recording on mount
  useEffect(() => {
    startRecording();
    return () => stopRecording();
  }, []);

  // Ask question about conversation on new chat message
  const respondToMessage = useCallback(async (query: string, history: string[]) => {
    if (classId) {
      const response = await trpc.chat.respondToMessage.query({ query, history, classId });
      return response.response;
    }
    else {
      return "No talking detected! Cannot respond without context.";
    }
  }, [])

  return (
    <div className="w-full h-screen flex flex-col">
      {/* TranscriptionBox container - fixed height */}
      <div className="w-full shrink-0 p-4">
        {TranscriptionBox({
          isRecording,
          startRecording,
          stopRecording,
          transcription,
          buttons: [{ name: "Reset", onClick: () => { resetClassId() } }]
        })}
      </div>

      {/* ChattingBox container - fills remaining space */}
      <div className="flex-1 w-full p-4">
        {<ChattingBox responder={respondToMessage} />}
      </div>
    </div>
  );
}

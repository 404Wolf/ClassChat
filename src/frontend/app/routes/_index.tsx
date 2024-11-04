import { MetaFunction } from "@remix-run/node";
import metadata from "~/meta";
import { useEffect } from "react";
import { useAudioTranscription } from "~/hooks/useAudioTranscription";
import TranscriptionBox from "~/components/TranscriptionBox";
import ChattingBox from "~/components/ChattingBox";

export const meta: MetaFunction = () => {
  return [
    { title: metadata.name },
    { name: "description", content: metadata.description },
  ];
};

export default function Index() {
  const {
    transcription,
    isRecording,
    startRecording,
    stopRecording,
    resetClassId
  } = useAudioTranscription();

  // Start recording on mount
  useEffect(() => {
    startRecording();
    return () => stopRecording();
  }, []);

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
        {ChattingBox()}
      </div>
    </div>
  );
}

import { LoaderFunction, MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import metadata from "~/meta";
import { useEffect } from "react";
import trpc from "~/trpc";
import { v4 as uuid } from "uuid";
import TranscriptionBox, { TranscriptionContainerButton } from "~/components/transcription/TranscriptionContainer";
import { RefreshCw as ResetIcon } from 'lucide-react';
import ChatContainer, { ChatMessage } from "~/components/chat/ChatContainer";
import { useChunkedAudioRecord } from "~/hooks/useChunkedAudioRecord";

export const meta: MetaFunction = () => {
  return [
    { title: metadata.name },
    { name: "description", content: metadata.description },
  ];
};

export const loader: LoaderFunction = async ({ params, request }) => {
  const { classId } = params;
  if (!classId) {
    return { status: 404, error: "Class not found" };
  }

  const classData = await trpc.classes.getClass.query({ uuid: classId! });

  if (!classData) {
    return await trpc.classes.addClass.mutate({
      uuid: classId,
      name: "Test class",
      description: "This is a test class!",
    });
  }
  else {
    return classData;
  }
}

export default () => {
  const classData = useLoaderData();
  console.log(classData);

  const {
    isRecording,
    startRecording,
    stopRecording,
  } = useChunkedAudioRecord({
    intervalDuration: 5000,
    onAudioChunk: (audioChunk: string) => {
      console.log("audioChunk", audioChunk);
    }
  });

  useEffect(() => {
    startRecording();
    return () => stopRecording();
  }, []);

  return (
    <div className="w-full h-screen flex flex-col">
      <div className="w-full shrink-0 p-4">
        <TranscriptionBox
          isRecording={isRecording}
          startRecording={startRecording}
          stopRecording={stopRecording}
          transcription={"Placeholder"}
          otherButtons={[
            <TranscriptionContainerButton
              name={"Reset"}
              icon={<ResetIcon />}
              onClick={() => window.location.href = `/classes/${uuid()}`}
            />
          ]}
        />
      </div>
      <div className="flex-1 w-full p-4">
        {<ChatContainer
          history={[] as ChatMessage[]}
          onSend={console.log}
          canSend={true}
        />}
      </div>
    </div>
  );
}

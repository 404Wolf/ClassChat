import { LoaderFunction, MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import metadata from "~/meta";
import { useEffect, useState } from "react";
import trpc from "~/trpc";
import { v4 as uuid } from "uuid";
import TranscriptionBox from "~/components/transcription/TranscriptionContainer";
import { RefreshCw as ResetIcon } from 'lucide-react';
import ChatContainer, { ChatMessage } from "~/components/chat/ChatContainer";
import { useChunkedAudioRecord } from "~/hooks/useChunkedAudioRecord";
import { TranscriptionButton } from "~/components/transcription/TranscriptionButton";

export const meta: MetaFunction = () => {
  return [
    { title: metadata.name },
    { name: "description", content: metadata.description },
  ];
};

interface ClassData {
  readonly id: number;
  readonly uuid: string;
  readonly name: string;
}

export const loader: LoaderFunction = async ({ params }): Promise<ClassData> => {
  const { classId } = params;

  let classData = await trpc.classes.getClass.query({ uuid: classId! });

  if (!classData) {
    await trpc.classes.addClass.mutate({
      uuid: classId!,
      name: "Class name",
      description: "An awesome class!",
    });
    const newClassData = await trpc.classes.getClass.query({ uuid: classId! });
    return newClassData!;
  }

  return classData;
}

export default () => {
  const classData = useLoaderData() as ClassData;
  const [transcriptionData, setTranscriptionData] = useState<string>("");

  const {
    isRecording,
    startRecording,
    stopRecording,
  } = useChunkedAudioRecord({
    intervalDuration: 7000,
    onAudioChunk: (audioChunk: string) => {
      console.log("Received audio chunk. Size", audioChunk.length);
      trpc.audio.sendChunk.mutate({ classId: classData.id, b64: audioChunk }).then(({ chunk }) => {
        setTranscriptionData(transcriptionData => transcriptionData + " " + chunk);
      })
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
          transcription={transcriptionData}
          otherButtons={[
            <TranscriptionButton
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

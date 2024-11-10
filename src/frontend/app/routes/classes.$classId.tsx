import { MetaFunction } from "@remix-run/node";
import { useParams } from "@remix-run/react";
import metadata from "~/meta";
import { useCallback, useEffect, useState } from "react";
import { useAudioTranscription } from "~/hooks/useAudioTranscription";
import trpc from "~/trpc";
import { v4 as uuid } from "uuid";
import TranscriptionBox, { TranscriptionContainerButton } from "~/components/transcription/TranscriptionContainer";
import { RefreshCw as ResetIcon } from 'lucide-react';
import ChatContainer, { ChatMessage } from "~/components/chat/ChatContainer";

const NO_TALKING_MSG = "Sorry, I can't hear you. I cannot respond without context.";

export const meta: MetaFunction = () => {
  return [
    { title: metadata.name },
    { name: "description", content: metadata.description },
  ];
};

export default function Index() {
  const { classId } = useParams();
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);

  const {
    transcription,
    isRecording,
    startRecording,
    stopRecording,
  } = useAudioTranscription({ classId: classId || "" });

  useEffect(() => {
    startRecording();
    return () => stopRecording();
  }, []);

  useEffect(() => {
    (async () => {
      if (classId) {
        const history = await trpc.chat.getChatHistory.query({ classId })
        setChatHistory(history);
      };
    })()
  }, [classId]);

  const respondToMessage = useCallback(async (query: string, history: string[]): Promise<string> => {
    console.log("Responding to message:", query);
    console.log("Current classId:", classId);
    if (classId) {
      const hasTranscription = await trpc.audio.hasTranscription.query({ classId });
      if (!hasTranscription) {
        return NO_TALKING_MSG;
      }
      const response = await trpc.chat.respondToMessage.query({ query, history, classId });

      const allMessages = [...chatHistory, { role: 'user', content: query }, { role: 'assistant', content: response.response }];
      await trpc.chat.saveChatHistory.mutate({ classId, messages: allMessages });
      console.log("Response:", response.response);

      return response.response;
    } else {
      return NO_TALKING_MSG;
    }
  }, [classId]);

  return (
    <div className="w-full h-screen flex flex-col">
      <div className="w-full shrink-0 p-4">
        {TranscriptionBox({
          isRecording,
          startRecording,
          stopRecording,
          transcription,
          otherButtons: [
            <TranscriptionContainerButton
              name={"Reset"}
              icon={<ResetIcon />}
              onClick={() => window.location.href = `/classes/${uuid()}`}
            />
          ]
        })}
      </div>
      <div className="flex-1 w-full p-4">
        {<ChatContainer history={history} />}
      </div>
    </div>
  );
}

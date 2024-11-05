import { MetaFunction } from "@remix-run/node";
import { useParams } from "@remix-run/react";
import metadata from "~/meta";
import { useCallback, useEffect, useState } from "react";
import { useAudioTranscription } from "~/hooks/useAudioTranscription";
import TranscriptionBox from "~/components/TranscriptionBox";
import ChattingBox, { ChatHistoryMessage } from "~/components/ChattingBox";
import trpc from "~/trpc";
import { v4 as uuid } from "uuid";

const NO_TALKING_MSG = "Sorry, I can't hear you. I cannot respond without context.";

export const meta: MetaFunction = () => {
  return [
    { title: metadata.name },
    { name: "description", content: metadata.description },
  ];
};

export default function Index() {
  const { classId } = useParams();
  const [chatHistory, setChatHistory] = useState<ChatHistoryMessage[]>([]);

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
    if (classId) {
      trpc.chat.getChatHistory.query({ classId }).then((history) => {
        console.log("Chat history:", history)
        setChatHistory(history.messages)
      })
    };
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
          buttons: [
            {
              name: "Reset",
              onClick: () => window.location.href = `/classes/${uuid()}`,
            }
          ]
        })}
      </div>
      <div className="flex-1 w-full p-4">
        {<ChattingBox responder={respondToMessage} history={chatHistory} />}
      </div>
    </div>
  );
}

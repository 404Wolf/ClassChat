import { LoaderFunction, MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { MainLayout } from "~/components/layouts/MainLayout";
import metadata from "~/meta";
import { useTranscriptionChat } from "~/hooks/useTranscriptionChat";
import ChatContainer, { ChatMessage } from "~/components/core/chat/ChatContainer";
import TranscriptionBox from "~/components/core/transcription/TranscriptionContainer";
import { ArrowRight } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import useTypewriter from "~/hooks/useTypewriter";
import trpc from "~/trpc";
import { v4 as uuid } from "uuid";

const QUERY_TYPING_SPEED = 50
const TRANSCRIPTION_TYPING_SPEED = 2200
const PAUSE_BETWEEN_EXAMPLES = 850
const PLACEHOLDER_INITIAL_TRANSCRIPTION = [
  `Hello, I'm Wolf, creator of ClassChat! `,
  `ClassChat lets you ask questions about the world around you, as events happen, live! `,
  `Did you miss what I just said class chat does? `, `Ask!`]

export const meta: MetaFunction = () => {
  return [
    { title: `${metadata.name} - Transcription` },
    { name: "description", content: metadata.description },
  ];
};

export const loader: LoaderFunction = async () => {
  const uuid = await trpc.classes.getExampleClass.query();
  return { classId: uuid };
};

const examples = [
  "Wait what is this app??",
  "What did they just say?",
  "What does class chat do?",
  "Can you repeat that?"
]

const InfoBox = ({ children }: { children: React.ReactNode }) => (
  <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-full pl-4">
    <div className="-translate-x-10 flex items-center">
      <div className="bg-white p-6 rounded-lg border shadow-lg w-[350px] z-20">
        <p className="text-gray-800 text-xl font-medium">{children}</p>
      </div>
      <div className="scale-[200%] scale-x-[220%] translate-x-2 z-0">
        <ArrowRight className="text-gray-400" />
      </div>
    </div>
  </div>
);

export default function TranscriptionRoute() {
  const { classId } = useLoaderData() as { classId: string };
  const [textBeingTyped, setTextBeingTyped] = useState<number>(0);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);

  const queryTypewriter = useTypewriter(QUERY_TYPING_SPEED, examples[textBeingTyped]);
  const transcriptionTypewriter = useTypewriter(TRANSCRIPTION_TYPING_SPEED, PLACEHOLDER_INITIAL_TRANSCRIPTION);

  const {
    classData,
    transcriptionData,
    isRecording,
    startRecording,
    stopRecording,
  } = useTranscriptionChat(classId, transcriptionTypewriter.displayText);


  const handleMessageSent = useCallback((message: string) => {
    trpc.chats.respondToDemoChatMessage.query({
      query: message,
      messages: chatHistory.map((msg) => ({
        role: msg.sender,
        content: msg.text,
      })),
      transcription: transcriptionData,
    })
      .then((response: string) => {
        setChatHistory((chatHistory) => {
          const newHistory = [
            ...chatHistory,
            {
              id: uuid(),
              sender: "bot",
              text: response,
              timestamp: new Date(),
            },
          ];
          console.log("Updating chat history", newHistory);
          return newHistory;
        });
      });
  }, [classData, transcriptionData, isRecording]);

  useEffect(() => {
    if (queryTypewriter.doneTyping) {
      setTextBeingTyped((prev) => (prev + 1) % examples.length);
      setTimeout(() => {
        queryTypewriter.reset()
        queryTypewriter.changeTypingText(examples[textBeingTyped])
      }, PAUSE_BETWEEN_EXAMPLES)
    }
  }, [queryTypewriter.doneTyping]);

  useEffect(() => {
    if (isRecording) {
      transcriptionTypewriter.resumeTyping()
    }
    else {
      transcriptionTypewriter.pauseTyping()
    }
  }, [isRecording])

  if (!classData) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <div className="text-2xl text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <MainLayout>
      <div className="flex flex-col my-auto">
        <div className="flex-1 p-8">
          <h1 className="text-5xl font-bold mb-8 text-center text-gray-800">
            Chat with the World!
          </h1>
          <div className="relative p-6 rounded-2xl shadow-xl bg-white border border-2">
            <div className="relative mb-6">
              <InfoBox>
                A live transcription of the outside world
              </InfoBox>
              <div className="h-[20vh]">
                <TranscriptionBox
                  isRecording={isRecording}
                  startRecording={startRecording}
                  stopRecording={stopRecording}
                  transcription={transcriptionData}
                />
              </div>
            </div>

            <div className="relative">
              <InfoBox>
                Use the chat box to ask questions about the world around you.
                <br />
                <br />
                The live transcription will provide context for your queries.
              </InfoBox>
              <div className="h-[30vh] relative">
                <ChatContainer
                  placeholderInput={queryTypewriter.displayText}
                  history={chatHistory}
                  setHistory={setChatHistory}
                  onSend={handleMessageSent}
                  canSend={true}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
} 

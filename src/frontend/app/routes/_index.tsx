import { LoaderFunction, MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { MainLayout } from "~/components/layouts/MainLayout";
import metadata from "~/meta";
import { v4 as uuid } from "uuid";
import { useTranscriptionChat } from "~/hooks/useTranscriptionChat";
import ChatContainer, { ChatMessage } from "~/components/core/chat/ChatContainer";
import TranscriptionBox from "~/components/core/transcription/TranscriptionContainer";
import { ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import useTypewriter from "~/hooks/useTypewriter";

const TYPING_SPEED = 50
const PAUSE_BETWEEN_EXAMPLES = 850
const PLACEHOLDER_INITIAL_TRANSCRIPTION = `Hello, I'm Wolf, creator of ClassChat! 
ClassChat lets you ask questions about the world around you, as events happen, live!
Did you miss what I just said class chat does? Ask!`.replace(/\n/g, " ")

export const meta: MetaFunction = () => {
  return [
    { title: `${metadata.name} - Transcription` },
    { name: "description", content: metadata.description },
  ];
};

export const loader: LoaderFunction = async () => {
  const classId = uuid();
  return { classId };
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

  const typewriter = useTypewriter(TYPING_SPEED, examples[textBeingTyped]);

  useEffect(() => {
    if (typewriter.doneTyping) {
      setTextBeingTyped((prev) => (prev + 1) % examples.length);
      setTimeout(() => {
        typewriter.reset()
        typewriter.changeTypingText(examples[textBeingTyped])
      }, PAUSE_BETWEEN_EXAMPLES)
    }
  }, [typewriter.doneTyping]);


  const {
    classData,
    transcriptionData,
    isRecording,
    startRecording,
    stopRecording,
  } = useTranscriptionChat(classId, PLACEHOLDER_INITIAL_TRANSCRIPTION);

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
          <div className="relative p-6 rounded-2xl shadow-xl bg-white">
            <div className="relative mb-12">
              <InfoBox>
                A live transcription of the outside world
              </InfoBox>
              <TranscriptionBox
                isRecording={isRecording}
                startRecording={startRecording}
                stopRecording={stopRecording}
                transcription={transcriptionData}
              />
            </div>

            <div className="relative">
              <InfoBox>
                Use the chat box to ask questions about the world around you.
                <br />
                <br />
                The live transcription will provide context for your queries.
              </InfoBox>
              <ChatContainer
                placeholderInput={typewriter.displayText}
                history={[] as ChatMessage[]}
                onSend={console.log}
                canSend={true}
              />
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
} 

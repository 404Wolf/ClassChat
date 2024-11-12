
import { Mic, MicOff } from 'lucide-react';
import { TranscriptionButton } from './TranscriptionButton';
import { useMemo } from 'react';

const WAITING_MESSAGE = "Waiting for voice...";

interface TranscriptionBoxProps {
  transcription: string | null;
  isRecording: boolean;
  startRecording: () => void;
  stopRecording: () => void;
  otherButtons?: React.ReactNode[];
  waitingMessage?: string;
}

export default function TranscriptionBox({
  isRecording,
  startRecording,
  stopRecording,
  transcription,
  otherButtons = [],
  waitingMessage = WAITING_MESSAGE,
}: TranscriptionBoxProps) {
  const buttons = useMemo(() => [
    <TranscriptionButton
      name={isRecording ? "Stop Recording" : "Start Recording"}
      icon={isRecording ? <Mic className="w-6 h-6 text-red-600" /> : <MicOff className="w-5 h-5 text-gray-500" />}
      onClick={isRecording ? stopRecording : startRecording}
      backgroundColor={isRecording ? "bg-red-100 animate-pulse border border-gray-400" : undefined}
    />,
    ...otherButtons
  ], [isRecording, startRecording, stopRecording, otherButtons]);


  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 relative overflow-y-auto p-4 rounded-lg border border-gray-300 shadow-sm bg-white">
        {transcription ? (
          <p className="text-gray-700 whitespace-pre-wrap">
            {transcription}
          </p>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-gray-400">
            {isRecording && waitingMessage}
          </div>
        )}

        <div className="absolute bottom-4 right-4 gap-4 flex">
          {buttons.map((button, index) => (
            <div key={index}>{button}</div>
          ))}
        </div>
      </div>
    </div>
  );
}

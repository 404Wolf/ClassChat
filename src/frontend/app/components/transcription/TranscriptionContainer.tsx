
import { Mic, MicOff } from 'lucide-react';

const WAITING_MESSAGE = "Waiting for voice...";

interface TranscriptionBoxProps {
  transcription: string | null;
  isRecording: boolean;
  startRecording: () => void;
  stopRecording: () => void;
  otherButtons?: React.ReactNode[];
  waitingMessage?: string;
}

export function TranscriptionContainerButton({ name, icon, onClick }: { name: string, icon: React.ReactNode, onClick: () => void }) {
  return (
    <button onClick={onClick} className="btn">
      {icon}
      <span className="text-sm">{name}</span>
    </button>
  );
}

export default function TranscriptionBox({
  isRecording,
  startRecording,
  stopRecording,
  transcription,
  otherButtons = [],
  waitingMessage = WAITING_MESSAGE
}: TranscriptionBoxProps) {
  return (
    <div className="relative min-h-[200px] overflow-y-auto p-4 rounded-lg border border-gray-300 shadow-sm">
      {transcription ? (
        <p className="text-gray-700 whitespace-pre-wrap mb-12">
          {transcription}
        </p>
      ) : (
        <div className="absolute inset-0 flex items-center justify-center text-gray-400">
          {isRecording && waitingMessage}
        </div>
      )}

      <div className="absolute bottom-4 right-4">
        <TranscriptionContainerButton
          name={isRecording ? "Stop Recording" : "Start Recording"}
          icon={isRecording ? <Mic className="w-5 h-5 text-red-500 animate-pulse" /> : <MicOff className="w-5 h-5 text-gray-500" />}
          onClick={isRecording ? stopRecording : startRecording}
        />
        {...otherButtons}
      </div>
    </div>
  );
}

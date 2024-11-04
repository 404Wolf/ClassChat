import { Mic, MicOff } from 'lucide-react';

interface TranscriptionBoxProps {
  transcription: string | null;
  isRecording: boolean;
  startRecording: () => void;
  stopRecording: () => void;
  buttons?: { name: string, onClick: () => void }[];
}

const WAITING_MESSAGE = "Waiting for voice...";

function Button({ name, onClick }: { name: string, onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`text-sm px-3 py-1 rounded-full transition-colors bg-green-100 text-green-700 hover:bg-green-200`}
    >
      {name}
    </button>
  );
}

export default function TranscriptionBox({
  isRecording,
  startRecording,
  stopRecording,
  transcription,
  buttons
}: TranscriptionBoxProps) {
  const buttonElements = [
    { name: "Start", onClick: startRecording },
    { name: "Stop", onClick: stopRecording },
    ...(buttons || [])]?.map((button, index) => (
      <Button key={index} name={button.name} onClick={button.onClick} />
    ));

  return (
    <div className="relative">
      {/* Status Bar */}
      <div className="flex items-center justify-between mb-2 px-3">
        <div>
          <div className="flex items-center gap-2">
            {isRecording ? (
              <>
                <Mic className="w-5 h-5 text-red-500 animate-pulse" />
                <span className="text-sm text-red-500">Recording...</span>
              </>
            ) : (
              <>
                <MicOff className="w-5 h-5 text-gray-500" />
                <span className="text-sm text-gray-500">Paused</span>
              </>
            )}
          </div>
        </div>

        <div className="flex gap-2">
          {buttonElements}
        </div>
      </div>

      <div className="relative min-h-[200px] max-h-[400px] overflow-y-auto p-4 bg-white rounded-lg border border-gray-300 shadow-sm">
        {transcription ? (
          <p className="text-gray-700 whitespace-pre-wrap">
            {transcription}
          </p>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-gray-400">
            {isRecording && WAITING_MESSAGE}
          </div>
        )}
      </div>

      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-8" />
    </div>
  );
}

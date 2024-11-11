import { Send } from "lucide-react";
import { useCallback, useRef, useState } from "react";

interface ChatInputProps {
  inputPlaceholder?: string;
  sendIcon?: React.ReactNode;
  onSend: (message: string) => void;
  isDisabled?: boolean;
}

export default function ChatInput({
  inputPlaceholder = "Message",
  sendIcon,
  isDisabled,
  onSend
}: ChatInputProps) {
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = useCallback(() => {
    const message = inputValue.trim();
    onSend(message);
  }, []);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  }, [])

  return (
    <div className="shrink-0 border-t border-gray-300 pt-6 pb-2 pl-2 pr-2">
      <div className="flex gap-2">
        <input
          type="text"
          ref={inputRef}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isDisabled}
          placeholder={inputPlaceholder}
          className="flex-1 resize-none p-2 min-h-[44px] max-h-[120px] input input-bordered"
        />
        <button
          onClick={handleSubmit}
          disabled={!inputValue.trim()}
          className="shrink-0 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {sendIcon ?? <Send className="w-5 h-5" />}
        </button>
      </div>
    </div>
  );
}

import { Send } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

interface ChatInputProps {
  placeholderInput?: string;
  sendIcon?: React.ReactNode;
  onSend: (message: string) => void;
  isDisabled?: boolean;
  focusOnLoad?: boolean;
}

export default function ChatInput({
  placeholderInput = "Message",
  sendIcon,
  isDisabled,
  onSend,
  focusOnLoad = true
}: ChatInputProps) {
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (focusOnLoad && inputRef.current) {
      inputRef.current.focus();
    }
  }, [focusOnLoad]);

  const handleSubmit = useCallback(() => {
    const message = inputValue.trim();
    if (!message) return;
    onSend(message);
    setInputValue('');
    inputRef.current?.focus();
  }, [inputValue, onSend]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  }, [handleSubmit]);

  return (
    <div className="shrink-0 border-t border-gray-300 p-4">
      <div className="flex gap-2">
        <input
          type="text"
          ref={inputRef}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isDisabled}
          placeholder={placeholderInput}
          className="flex-1 resize-none p-2 min-h-[44px] max-h-[120px] rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
        />
        <button
          onClick={handleSubmit}
          disabled={isDisabled || !inputValue.trim()}
          className="shrink-0 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {sendIcon ?? <Send className="w-5 h-5" />}
        </button>
      </div>
    </div>
  );
}

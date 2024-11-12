import { useRef, useMemo, useCallback } from 'react';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';

export interface ChatMessage {
  id: string;
  text: string;
  timestamp: Date;
  sender: string;
}

export interface ChatMessageBoxProps {
  history: ChatMessage[];
  onSend: (message: string) => void;
  canSend?: boolean;
  noMessagesPlaceholder?: string;
  placeholderInput?: string;
}

const ChatMessageBox = ({
  history,
  onSend,
  canSend = true,
  noMessagesPlaceholder = "No messages sent",
  placeholderInput,
}: ChatMessageBoxProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleSubmit = useCallback((message: string) => {
    onSend(message);
  }, [onSend]);

  const hasMessages = useMemo(() => history.length > 0, [history]);

  const Messages = () => (
    !hasMessages ? (
      <div className={`flex items-center justify-center h-full`}>
        <div className="text-gray-400">
          {noMessagesPlaceholder}
        </div>
      </div>
    ) : (
      <div className="space-y-3">
        {history.map((message: ChatMessage) =>
          <ChatMessage
            key={message.id}
            id={message.id}
            text={message.text}
            timestamp={message.timestamp}
            you={message.sender === "You"}
          />
        )}
        <div ref={messagesEndRef} />
      </div>
    )
  )

  return (
    <div className="bg-white rounded-lg border border-gray-300 shadow-sm flex flex-col h-full">
      <div className="flex flex-col flex-grow overflow-y-auto p-4 container">
        <Messages />
        <div className="flex-grow" />
      </div>
      <div className="border-t border-gray-300">
        <ChatInput
          isDisabled={!canSend}
          onSend={handleSubmit}
          placeholderInput={placeholderInput}
        />
      </div>
    </div>
  );
};

export default ChatMessageBox;

import { useState, useRef, useMemo, useCallback, useEffect } from 'react';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import { v4 as uuid } from 'uuid';

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
}

const ChatMessageBox = ({
  history,
  onSend,
  canSend = true,
  noMessagesPlaceholder = "No messages sent"
}: ChatMessageBoxProps) => {
  const [messages, setMessages] = useState<ChatMessage[]>(history);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Update messages when history changes
  useEffect(() => {
    setMessages(history);
  }, [history]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = useCallback((message: string) => {
    const newMessage = {
      id: uuid(),
      text: message,
      timestamp: new Date(),
      sender: "You"
    };

    onSend(message);
    setMessages(prevMessages => [...prevMessages, newMessage]);
  }, [onSend]);

  const hasMessages = useMemo(() => messages.length > 0, [messages]);

  return (
    <div className="flex flex-col h-full">
      <div className="flex flex-col grow bg-white rounded-lg border border-gray-300 shadow-sm">
        <div className="flex-1 overflow-y-auto p-4">
          {!hasMessages ? (
            <div className="h-full flex items-center justify-center">
              <div className="text-gray-400">
                {noMessagesPlaceholder}
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {messages.map(message =>
                <ChatMessage
                  key={message.id}
                  id={message.id}
                  text={message.text}
                  timestamp={message.timestamp}
                  you={message.sender === "You"}
                />
              )}
              < div ref={messagesEndRef} />
            </div>
          )}
        </div>
        <div className="border-t border-gray-300">
          <ChatInput
            isDisabled={!canSend}
            onSend={handleSubmit}
          />
        </div>
      </div>
    </div>
  );
};

export default ChatMessageBox;

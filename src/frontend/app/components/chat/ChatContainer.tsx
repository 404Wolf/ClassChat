import { useState, useRef } from 'react';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import { v4 as uuid } from 'uuid';

export interface ChatMessage {
  id: string;
  text: string;
  timestamp: Date;
}

export interface ChatMessageBoxProps {
  history: ChatMessage[];
  onSend: (message: string) => void;
  canSend?: boolean;
  noMessagesPlaceholder?: string;
}

const ChatMessageBox = ({ history, onSend, canSend = true, noMessagesPlaceholder = "No messages sent" }: ChatMessageBoxProps) => {
  const [messages, setMessages] = useState<ChatMessage[]>(history);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleSubmit = () => {
    if (inputValue === '') return;
    onSend(inputValue)
    setMessages([...messages, { id: uuid(), text: inputValue, timestamp: new Date() }]);
    setInputValue('');
  };

  return (
    <div className="flex flex-col h-full grow bg-white rounded-lg border border-gray-300 shadow-sm chat-start">
      <div className="flex-1 overflow-y-auto p-4">
        {messages.length === 0 ? (
          <div className="h-full flex items-center justify-center text-gray-400">
            {noMessagesPlaceholder}
          </div>
        ) : (
          <div className="space-y-3">
            {history.map(message => (
              <ChatMessage
                id={message.id}
                text={message.text}
                timestamp={message.timestamp}
                you={true}
              />
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="shrink-0 border-t border-gray-300 p-4">
        <div className="flex gap-2">
          <ChatInput isDisabled={canSend} onSend={handleSubmit} />
        </div>
      </div>
    </div>
  );
};


export default ChatMessageBox;

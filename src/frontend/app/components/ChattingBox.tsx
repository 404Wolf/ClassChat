import React, { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  timestamp: Date;
}

const ENTRY_BOX_MESSAGE = "Type a message... (Press Enter to send)"

interface ChatMessageBoxProps {
  responder: (messsage: string, history: string[]) => Promise<string>;
}

const ChatMessageBox = ({ responder }: ChatMessageBoxProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = () => {
    if (inputValue.trim()) {
      setMessages(prev => {
        const newUserMessage = {
          id: crypto.randomUUID(),
          text: inputValue.trim(),
          timestamp: new Date()
        };
        return [...prev, newUserMessage];
      });
      setInputValue('');
      responder(inputValue.trim(), messages.map(m => m.text)).then(response => {
        setMessages(prev => {
          const newBotMessage = {
            id: crypto.randomUUID(),
            text: response,
            timestamp: new Date()
          };
          return [...prev, newBotMessage];
        });
      });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="flex flex-col h-full grow bg-white rounded-lg border border-gray-300 shadow-sm">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4">
        {messages.length === 0 ? (
          <div className="h-full flex items-center justify-center text-gray-400">
            No messages yet...
          </div>
        ) : (
          <div className="space-y-3">
            {messages.map(message => (
              <div key={message.id} className="bg-gray-100 rounded-lg p-3">
                <p className="text-gray-700 whitespace-pre-wrap text-lg">{message.text}</p>
                <span className="text-xs text-gray-400">
                  {message.timestamp.toLocaleTimeString()}
                </span>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="shrink-0 border-t border-gray-300 p-4">
        <div className="flex gap-2">
          <textarea
            ref={inputRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={ENTRY_BOX_MESSAGE}
            className="flex-1 resize-none rounded-lg border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[44px] max-h-[120px]"
            rows={1}
          />
          <button
            onClick={handleSubmit}
            disabled={!inputValue.trim()}
            className="shrink-0 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};


export default ChatMessageBox;

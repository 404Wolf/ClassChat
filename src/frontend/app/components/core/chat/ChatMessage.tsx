interface ChatMessageBoxProps {
  id: string;
  text: string;
  timestamp: Date;
  you: boolean;
}

const ChatMessage = ({ text, timestamp, you }: ChatMessageBoxProps) => {
  const chatMessage = <>
    <div className="chat-bubble bg-gray-200">
      <p className="text-gray-700 whitespace-pre-wrap text-lg">{text}</p>
      <span className="text-xs text-gray-400">
        {timestamp.toLocaleTimeString()}
      </span>
    </div>
  </>
  if (you) return (
    <div className="chat chat-end">
      {chatMessage}
    </div>
  );
  else (
    <div className="chat chat-start">
      {chatMessage}
    </div>
  );
};


export default ChatMessage;

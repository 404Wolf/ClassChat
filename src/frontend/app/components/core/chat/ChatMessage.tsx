interface ChatMessageBoxProps {
  id: string;
  text: string;
  timestamp: Date;
  you: boolean;
}

const ChatMessage = ({ text, timestamp, you }: ChatMessageBoxProps) => {
  const chatMessage = <>
    <div className={`chat-bubble shadow-sm ${you ? "bg-blue-50" : "bg-stone-100"}`}>
      <p className="text-gray-700 whitespace-pre-wrap text-lg">{text}</p>
      <span className="text-xs text-gray-400">
        {timestamp.toLocaleTimeString()}
      </span>
    </div>
  </>

  return (you ? (
    <div className="chat chat-end">
      {chatMessage}
    </div>
  ) :
    (
      <div className="chat chat-start">
        {chatMessage}
      </div>
    ))
};


export default ChatMessage;

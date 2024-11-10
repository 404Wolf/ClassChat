interface ChatMessageBoxProps {
  id: string;
  text: string;
  timestamp: Date;
  you: boolean;
}

const ChatMessageBox = ({ id, text, timestamp, you }: ChatMessageBoxProps) => {
  return (
    <>
      <div key={id} className="chat-bubble">
        <p className="text-gray-700 whitespace-pre-wrap text-lg">{text}</p>
        <span className="text-xs text-gray-400">
          {timestamp.toLocaleTimeString()}
        </span>
      </div>
      ))
    </>
  );
};


export default ChatMessageBox;

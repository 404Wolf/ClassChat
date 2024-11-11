import React from 'react';
import { RefreshCw as ResetIcon } from 'lucide-react';
import { v4 as uuid } from 'uuid';
import TranscriptionBox from '../core/transcription/TranscriptionContainer';
import { TranscriptionButton } from '../core/transcription/TranscriptionButton';
import ChatContainer, { ChatMessage } from '../core/chat/ChatContainer';
import { useTranscriptionChat } from '~/hooks/useTranscriptionChat';

interface TranscriptionChatViewProps {
  classId: string;
}

const TranscriptionChatView: React.FC<TranscriptionChatViewProps> = ({ classId }) => {
  const {
    classData,
    transcriptionData,
    isRecording,
    startRecording,
    stopRecording,
  } = useTranscriptionChat(classId);

  if (!classData) {
    return <div className="w-full h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="flex flex-col h-full">
      <div>
        <TranscriptionBox
          isRecording={isRecording}
          startRecording={startRecording}
          stopRecording={stopRecording}
          transcription={transcriptionData}
          otherButtons={[
            <TranscriptionButton
              name="Reset"
              icon={<ResetIcon />}
              onClick={() => window.location.href = `/classes/${uuid()}`}
            />
          ]}
        />
      </div>
      <div className="flex-1 pt-4">
        <ChatContainer
          history={[] as ChatMessage[]}
          onSend={console.log}
          canSend={true}
        />
      </div>
    </div>
  );
};

export default TranscriptionChatView;     

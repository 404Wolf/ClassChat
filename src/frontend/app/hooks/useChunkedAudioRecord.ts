import { useCallback, useEffect, useState } from "react";
import { useReactMediaRecorder } from "react-media-recorder";
import { blobArrayToBase64 } from "~/utils";

export interface UseChunkedAudioRecordOptions {
  onAudioChunk: (chunk: string) => void;
  intervalDuration: number;
}

export interface UseChunkedAudioRecordReturn {
  isRecording: boolean;
  startRecording: () => void;
  stopRecording: () => void;
}

export function useChunkedAudioRecord({
  onAudioChunk,
  intervalDuration,
}: UseChunkedAudioRecordOptions): UseChunkedAudioRecordReturn {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingIntervalId, setRecordingIntervalId] = useState<number>(-1);

  const { startRecording: start, stopRecording: stop } = useReactMediaRecorder({
    audio: true,
    onStop: async (blobUrl) => {
      try {
        console.log("Shipping audio chunk to callback");

        const response = await fetch(blobUrl);
        const audioBlob = await response.blob();
        const base64Audio = await blobArrayToBase64(audioBlob);

        const durationEstimate = audioBlob.size / 16000 / 2;
        if (durationEstimate < 1) return;

        onAudioChunk(base64Audio);
      } catch (error) {
        console.error("Error converting or sending audio", error);
      }
    },
  });

  useEffect(() => {
    if (isRecording && recordingIntervalId === -1) {
      const newRecordingIntervalId = window.setInterval(() => {
        stop();
        start();
      }, intervalDuration);
      setRecordingIntervalId(newRecordingIntervalId);
      start();
    } else if (!isRecording && recordingIntervalId !== -1) {
      window.clearInterval(recordingIntervalId);
      setRecordingIntervalId(-1);
      stop();
    }

    return () => {
      if (recordingIntervalId !== -1) {
        window.clearInterval(recordingIntervalId);
        stop();
      }
    };
  }, [isRecording, intervalDuration]);

  const startRecording = useCallback(() => {
    setIsRecording(true);
  }, []);

  const stopRecording = useCallback(() => {
    setIsRecording(false);
  }, []);

  return {
    isRecording,
    startRecording,
    stopRecording,
  };
}

import { useState, useCallback } from "react";

export interface RecordHookProps {
  callback?: (audioBlob: Blob) => void;
  format?: string;
}

export const useRecord = ({ callback, format = "wav" }: RecordHookProps) => {
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
    null
  );

  const cleanupRecording = () => {
    if (mediaRecorder) {
      console.log(
        "Cleaning up recording: stopping tracks and resetting recorder."
      );
      mediaRecorder.stream.getTracks().forEach((track) => track.stop());
      setMediaRecorder(null);
    }
    setIsRecording(false);
    console.log("Cleanup complete: ready for next recording.");
  };

  const startRecording = useCallback(async () => {
    console.log("Attempting to start recording...");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      console.log("Microphone access granted.");
      const newMediaRecorder = new MediaRecorder(stream);
      setMediaRecorder(newMediaRecorder);
      const audioChunks: Blob[] = [];

      newMediaRecorder.ondataavailable = (event: BlobEvent) => {
        console.log("Data available event triggered, chunk received.");
        audioChunks.push(event.data);
      };

      newMediaRecorder.onstop = () => {
        console.log("Recording stopped, processing audio blob.");
        const audioBlob = new Blob(audioChunks, { type: `audio/${format}` });
        if (callback) {
          console.log("Audio blob created:", audioBlob);
          callback(audioBlob);
        }
        cleanupRecording();
      };

      newMediaRecorder.start();
      setIsRecording(true);
      console.log("Recording started.");
    } catch (error) {
      console.error("Error accessing microphone:", error);
    }
  }, [callback, format]);

  const stopRecording = useCallback(() => {
    if (mediaRecorder && isRecording) {
      console.log("Stopping recording...");
      mediaRecorder.stop();
    } else {
      console.log("No active recording to stop.");
    }
  }, [mediaRecorder, isRecording]);

  return {
    isRecording,
    startRecording,
    stopRecording,
  };
};

import { useCallback, useEffect, useState } from "react";
import { useReactMediaRecorder } from "react-media-recorder";
import { z } from "zod";
import trpc from "~/trpc";
import { blobArrayToBase64 } from "~/utils";

const INTERVAL_DURATION = 6000;

interface UseAudioTranscriptionOptions {
  classId: string;
  onTranscriptionUpdate?: (transcription: string) => void;
  intervalDuration?: number;
}

interface UseAudioTranscriptionReturn {
  transcription: string | null;
  isRecording: boolean;
  startRecording: () => void;
  stopRecording: () => void;
}

export function useAudioTranscription({
  classId,
  onTranscriptionUpdate,
  intervalDuration = INTERVAL_DURATION,
}: UseAudioTranscriptionOptions): UseAudioTranscriptionReturn {
  const [transcription, setTranscription] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingIntervalId, setRecordingIntervalId] = useState<number>(-1);

  const { startRecording: start, stopRecording: stop } = useReactMediaRecorder({
    audio: true,
    onStop: async (blobUrl) => {
      if (classId) {
        try {
          console.log("Sending audio chunk to server...");
          const response = await fetch(blobUrl);
          const audioBlob = await response.blob();
          const base64Audio = await blobArrayToBase64(audioBlob);

          const durationEstimate = audioBlob.size / 16000 / 2;
          if (durationEstimate < 1) return;

          const { transcription: newTranscription } =
            await trpc.audio.sendChunk.mutate({
              b64: base64Audio,
              classId,
            });

          setTranscription(newTranscription.whole);
          onTranscriptionUpdate?.(newTranscription.whole);
        } catch (error) {
          console.error("Error converting or sending audio:", error);
        }
      }
    },
  });

  useEffect(() => {
    trpc.audio.getTranscription
      .query({ classId })
      .then((transcriptionHistory) => {
        const transcription = transcriptionHistory.transcription;
        console.log("Got transcription:", transcription);
        setTranscription(transcription);
      })
      .catch((error) => {});
  }, [classId]);

  // Handle recording state changes
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
    transcription,
    isRecording,
    startRecording,
    stopRecording,
  };
}

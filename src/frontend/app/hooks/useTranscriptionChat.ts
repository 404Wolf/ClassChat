import { useEffect, useRef, useState } from "react";
import { useChunkedAudioRecord } from "~/hooks/useChunkedAudioRecord";
import trpc from "~/trpc";

const INTERVAL_DURATION = 4000;

interface ClassData {
  readonly id: number;
  readonly uuid: string;
  readonly name: string;
}

export const useTranscriptionChat = (
  classId: string,
  initialTranscriptionData?: string
) => {
  const classData = useRef<ClassData | null>(null);
  const [transcriptionData, setTranscriptionData] = useState<string>("");

  useEffect(() => {
    const initializeClass = async () => {
      const data = await trpc.classes.getClass.query({ uuid: classId });
      console.log("Got class data", data);
      classData.current = data;
    };

    initializeClass();
  }, [classId]);

  useEffect(() => {
    if (initialTranscriptionData) {
      setTranscriptionData(initialTranscriptionData);
    }
  }, [initialTranscriptionData, classData]);

  const { isRecording, startRecording, stopRecording } = useChunkedAudioRecord({
    intervalDuration: INTERVAL_DURATION,
    onAudioChunk: (audioChunk: string) => {
      console.log("Received audio chunk. Size", audioChunk.length);
      if (classData.current !== null) {
        console.log("Sending audio chunk to server for transcription");
        trpc.audio.sendChunk
          .mutate({
            classId: classData.current.id,
            b64: audioChunk,
          })
          .then(({ chunk }) => {
            if (chunk.toLowerCase().includes("for watching!")) {
              return;
            }
            setTranscriptionData(
              (transcriptionData) => transcriptionData + " " + chunk
            );
          });
      } else {
        console.log(
          "Ignoring audio chunk since class data has not been received yet"
        );
      }
    },
  });

  useEffect(() => {
    startRecording();
    return () => stopRecording();
  }, []);

  return {
    classData,
    transcriptionData,
    isRecording,
    startRecording,
    stopRecording,
  };
};

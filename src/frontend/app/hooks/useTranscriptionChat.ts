import { useEffect, useState } from "react";
import { useChunkedAudioRecord } from "~/hooks/useChunkedAudioRecord";
import trpc from "~/trpc";

interface ClassData {
  readonly id: number;
  readonly uuid: string;
  readonly name: string;
}

export const useTranscriptionChat = (
  classId: string,
  initialTranscriptionData?: string
) => {
  const [classData, setClassData] = useState<ClassData | null>(null);
  const [transcriptionData, setTranscriptionData] = useState<string>("");

  useEffect(() => {
    if (initialTranscriptionData) {
      setTranscriptionData(initialTranscriptionData);
    }
  }, []);

  const { isRecording, startRecording, stopRecording } = useChunkedAudioRecord({
    intervalDuration: 7000,
    onAudioChunk: (audioChunk: string) => {
      console.log("Received audio chunk. Size", audioChunk.length);
      if (classData) {
        trpc.audio.sendChunk
          .mutate({
            classId: classData.id,
            b64: audioChunk,
          })
          .then(({ chunk }) => {
            setTranscriptionData(
              (transcriptionData) => transcriptionData + " " + chunk
            );
          });
      }
    },
  });

  useEffect(() => {
    const initializeClass = async () => {
      let data = await trpc.classes.getClass.query({ uuid: classId });
      if (!data) {
        await trpc.classes.addClass.mutate({
          uuid: classId,
          name: "Class name",
          description: "An awesome class!",
        });
        data = await trpc.classes.getClass.query({ uuid: classId });
      }
      setClassData(data);
    };

    initializeClass();
  }, [classId]);

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


import { MetaFunction } from "@remix-run/node";
import metadata from "~/meta";
import { z } from "zod";
import trpc from "~/trpc";
import { blobArrayToBase64 } from "~/utils";
import { v4 as uuidv4 } from 'uuid';
import { useCallback, useEffect, useState } from "react";
import { useReactMediaRecorder } from "react-media-recorder";

const CLASS_ID_KEY = 'classid';
const INTERVAL_DURATION = 4000;

export const meta: MetaFunction = () => {
  return [
    { title: metadata.name },
    { name: "description", content: metadata.description },
  ];
};

const classID = z.string().uuid();

export default function Index() {
  const [classId, setClassId] = useState<string | null>(null);
  const [transcription, setTranscription] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingIntervalId, setRecordingIntervalId] = useState<number>(-1);

  const resetClassId = useCallback(() => {
    const newClassId = uuidv4();
    localStorage.setItem(CLASS_ID_KEY, newClassId);
    setClassId(newClassId);
  }, []);

  useEffect(() => {
    let storedClassId = localStorage.getItem(CLASS_ID_KEY);
    if (!storedClassId || !classID.safeParse(storedClassId).success) {
      storedClassId = uuidv4();
      localStorage.setItem(CLASS_ID_KEY, storedClassId);
    }
    setClassId(storedClassId);

    return () => setClassId(null);
  }, []);

  const { startRecording, stopRecording } = useReactMediaRecorder({
    audio: true,
    onStop: async (blobUrl) => {
      if (classId) {
        try {
          console.log("Sending audio chunk to server...");
          const response = await fetch(blobUrl);
          const audioBlob = await response.blob();
          const base64Audio = await blobArrayToBase64(audioBlob);
          const { transcription } = await trpc.audio.sendChunk.mutate({ b64: base64Audio, classId });
          setTranscription(transcription.whole);
        } catch (error) {
          console.error("Error converting or sending audio:", error);
        }
      }
    },
  });

  useEffect(() => {
    if (isRecording && recordingIntervalId === -1) {
      const newRecordingIntervalId = window.setInterval(() => {
        stopRecording();
        startRecording();
      }, INTERVAL_DURATION);
      setRecordingIntervalId(newRecordingIntervalId);
      startRecording();
    } else {
      window.clearInterval(recordingIntervalId);
      stopRecording();
    }
  }, [isRecording]);

  return (
    <div className="flex h-screen items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg h-1/2">
        <h1 className="text-2xl font-bold mb-4">Transcription</h1>
        <p className="text-gray-700">{transcription}</p>
        <div className="ml-8 bg-white p-8 rounded-lg shadow-lg b-1 absolute">
          <h1 className="text-2xl font-bold mb-4">Recorder</h1>
          <div className="flex flex-col items-center space-y-4">
            {isRecording && <p className="text-red-500">Recording...</p>}
            {!isRecording && (
              <button
                onClick={() => setIsRecording(true)}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Start recording
              </button>
            )}
            {isRecording && (
              <button
                onClick={() => setIsRecording(false)}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Stop recording
              </button>
            )}
            <button
              onClick={resetClassId}
              className="mt-2 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              Reset class ID
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

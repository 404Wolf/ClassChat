import {
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { classes } from "./classes";
import { users } from "./users";

export const transcriberType = pgEnum("transcriber_type", [
  "web_speech_api",
  "openai_whisper",
  "vosk",
  "deepspeech",
]);

export const recordingFormat = pgEnum("recording_format", [
  "webm",
  "mp3",
  "wav",
  "ogg",
]);

export const recordings = pgTable("recordings", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  classId: integer().references(() => classes.id),
  objectKey: varchar({ length: 255 }).notNull(),
  recordingFormat: recordingFormat().notNull(),
  startTime: timestamp().notNull(),
  endTime: timestamp().notNull(),
});

export const transcriptions = pgTable("transcriptions", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  classId: integer().references(() => classes.id),
  transcription: text(),
  createdAt: timestamp().defaultNow(),
  recorder: integer().references(() => users.id),
  transcriber: transcriberType().notNull(),
  notes: text(),
});

CREATE TYPE "public"."recording_format" AS ENUM('webm', 'mp3', 'wav', 'ogg');--> statement-breakpoint
CREATE TYPE "public"."transcriber_type" AS ENUM('web_speech_api', 'openai_whisper', 'vosk', 'deepspeech');--> statement-breakpoint
CREATE TYPE "public"."sender_type" AS ENUM('user', 'bot');--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "classes" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "classes_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" varchar(255) NOT NULL,
	"description" varchar(255) NOT NULL,
	"members" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "recordings" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "recordings_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"classId" integer,
	"objectKey" varchar(255) NOT NULL,
	"recordingFormat" "recording_format" NOT NULL,
	"startTime" timestamp NOT NULL,
	"endTime" timestamp NOT NULL,
	"transcriber" "transcriber_type" NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "transcriptions" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "transcriptions_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"classId" integer,
	"transcription" text,
	"createdAt" timestamp DEFAULT now(),
	"recorder" integer,
	"notes" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "accounts" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "accounts_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"userId" integer NOT NULL,
	"provider" varchar(255) NOT NULL,
	"providerAccountId" varchar(255) NOT NULL,
	"accessToken" varchar(255),
	"refreshToken" varchar(255),
	"expiresAt" timestamp,
	"createdAt" timestamp DEFAULT now(),
	CONSTRAINT "accounts_providerAccountId_unique" UNIQUE("providerAccountId")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "sessions" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "sessions_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"sessionToken" varchar(255) NOT NULL,
	"userId" integer NOT NULL,
	"expires" timestamp NOT NULL,
	CONSTRAINT "sessions_sessionToken_unique" UNIQUE("sessionToken")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "users_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" varchar(255),
	"email" varchar(255) NOT NULL,
	"emailVerified" timestamp,
	"imageUrl" varchar(255),
	"createdAt" timestamp DEFAULT now(),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "verification_tokens" (
	"identifier" varchar(255) NOT NULL,
	"token" varchar(255) NOT NULL,
	"expires" timestamp NOT NULL,
	CONSTRAINT "verification_tokens_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "messages" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "messages_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"senderId" integer NOT NULL,
	"repliesTo" integer,
	"message" varchar(255) NOT NULL,
	"prompt" varchar(255),
	"tokens" integer DEFAULT 0,
	"sentAt" timestamp NOT NULL,
	"createdAt" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "senders" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "senders_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"userId" integer,
	"role" "sender_type" NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "classes" ADD CONSTRAINT "classes_members_users_id_fk" FOREIGN KEY ("members") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "recordings" ADD CONSTRAINT "recordings_classId_classes_id_fk" FOREIGN KEY ("classId") REFERENCES "public"."classes"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "transcriptions" ADD CONSTRAINT "transcriptions_classId_classes_id_fk" FOREIGN KEY ("classId") REFERENCES "public"."classes"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "transcriptions" ADD CONSTRAINT "transcriptions_recorder_users_id_fk" FOREIGN KEY ("recorder") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "accounts" ADD CONSTRAINT "accounts_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "sessions" ADD CONSTRAINT "sessions_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "messages" ADD CONSTRAINT "messages_senderId_senders_id_fk" FOREIGN KEY ("senderId") REFERENCES "public"."senders"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "messages" ADD CONSTRAINT "messages_repliesTo_messages_id_fk" FOREIGN KEY ("repliesTo") REFERENCES "public"."messages"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "senders" ADD CONSTRAINT "senders_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

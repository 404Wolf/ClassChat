CREATE TABLE IF NOT EXISTS "chats" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "chats_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"classId" integer
);
--> statement-breakpoint
ALTER TABLE "transcriptions" ADD COLUMN "transcriber" "transcriber_type" NOT NULL;--> statement-breakpoint
ALTER TABLE "messages" ADD COLUMN "chatId" integer NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "chats" ADD CONSTRAINT "chats_classId_classes_id_fk" FOREIGN KEY ("classId") REFERENCES "public"."classes"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "messages" ADD CONSTRAINT "messages_chatId_chats_id_fk" FOREIGN KEY ("chatId") REFERENCES "public"."chats"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "recordings" DROP COLUMN IF EXISTS "transcriber";
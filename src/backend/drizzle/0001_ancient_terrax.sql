ALTER TABLE "classes" ALTER COLUMN "description" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "classes" ADD COLUMN "isExample" boolean DEFAULT false NOT NULL;
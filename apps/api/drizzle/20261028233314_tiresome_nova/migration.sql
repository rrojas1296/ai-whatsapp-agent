CREATE TABLE "business" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"name" varchar,
	"isDeleted" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "sessions" RENAME COLUMN "refresh_token" TO "refresh_hash";--> statement-breakpoint
ALTER TABLE "sessions" ADD COLUMN "business_id" uuid;
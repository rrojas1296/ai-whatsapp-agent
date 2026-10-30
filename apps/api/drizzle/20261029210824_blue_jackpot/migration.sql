ALTER TABLE "business" ADD COLUMN "ownerId" uuid;--> statement-breakpoint
ALTER TABLE "business" ADD CONSTRAINT "business_ownerId_users_id_fkey" FOREIGN KEY ("ownerId") REFERENCES "users"("id");
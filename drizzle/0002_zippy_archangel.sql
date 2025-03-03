ALTER TABLE "flatoinator3000_days" ALTER COLUMN "id" DROP IDENTITY;--> statement-breakpoint
ALTER TABLE "flatoinator3000_days" ALTER COLUMN "updated_at" SET DEFAULT CURRENT_TIMESTAMP;--> statement-breakpoint
ALTER TABLE "flatoinator3000_days" ALTER COLUMN "updated_at" SET NOT NULL;
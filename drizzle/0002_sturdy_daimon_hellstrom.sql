ALTER TABLE "user" ALTER COLUMN "name" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "email_verified" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "user_settings" ADD COLUMN "api_model" text DEFAULT 'minimax/minimax-m2.5:free';--> statement-breakpoint
ALTER TABLE "user_settings" ADD COLUMN "language" text DEFAULT 'id';--> statement-breakpoint
ALTER TABLE "user_settings" ADD COLUMN "notify_prd_generated" text DEFAULT 'true';--> statement-breakpoint
ALTER TABLE "user_settings" ADD COLUMN "notify_email_updates" text DEFAULT 'true';--> statement-breakpoint
ALTER TABLE "user_settings" ADD COLUMN "notify_marketing" text DEFAULT 'false';
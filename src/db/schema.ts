import { pgTable, uuid, text, timestamp } from "drizzle-orm/pg-core";
import { user, session, account, verification } from "@/lib/auth/db-schema";

// Re-export auth tables so they're included in migrations
export { user, session, account, verification };

export const projects = pgTable("projects", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  prompt: text("prompt").notNull(),
  deploymentTarget: text("deployment_target").notNull(),
  generatedPrd: text("generated_prd").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const userSettings = pgTable("user_settings", {
  userId: text("user_id")
    .primaryKey()
    .references(() => user.id, { onDelete: "cascade" }),
  apiKeyEncrypted: text("api_key_encrypted"),
  apiProvider: text("api_provider").default("openrouter"),
  apiModel: text("api_model").default("minimax/minimax-m2.5:free"),
  language: text("language").default("id"),
  notifyPrdGenerated: text("notify_prd_generated").default("true"),
  notifyEmailUpdates: text("notify_email_updates").default("true"),
  notifyMarketing: text("notify_marketing").default("false"),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

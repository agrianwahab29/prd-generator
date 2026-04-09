import { pgTable, uuid, text, timestamp } from "drizzle-orm/pg-core";
import { user } from "@/lib/auth/db-schema";

export const projects = pgTable("projects", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
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
  userId: uuid("user_id")
    .primaryKey()
    .references(() => user.id, { onDelete: "cascade" }),
  apiKeyEncrypted: text("api_key_encrypted"),
  apiProvider: text("api_provider").default("openrouter"),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

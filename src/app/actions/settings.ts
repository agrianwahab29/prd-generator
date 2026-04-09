"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/db";
import { userSettings } from "@/db/schema";
import { encrypt } from "@/lib/crypto";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function updateApiKey(formData: FormData) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  const apiKey = formData.get("apiKey") as string;
  const provider = formData.get("provider") as string;

  if (!apiKey || apiKey.trim().length === 0) {
    throw new Error("API Key wajib diisi");
  }

  if (!provider) {
    throw new Error("Provider wajib dipilih");
  }

  const encrypted = encrypt(apiKey.trim());

  await db
    .insert(userSettings)
    .values({
      userId: session.user.id,
      apiKeyEncrypted: encrypted,
      apiProvider: provider,
    })
    .onConflictDoUpdate({
      target: userSettings.userId,
      set: {
        apiKeyEncrypted: encrypted,
        apiProvider: provider,
        updatedAt: new Date(),
      },
    });

  revalidatePath("/dashboard/settings");

  return { success: true };
}

export async function getUserSettings() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return null;
  }

  const settings = await db
    .select({
      apiProvider: userSettings.apiProvider,
      hasApiKey: userSettings.apiKeyEncrypted,
    })
    .from(userSettings)
    .where(eq(userSettings.userId, session.user.id))
    .limit(1);

  if (settings.length === 0) {
    return { apiProvider: "openrouter", hasApiKey: null };
  }

  return {
    apiProvider: settings[0].apiProvider || "openrouter",
    hasApiKey: settings[0].hasApiKey ? "••••••••" : null,
  };
}

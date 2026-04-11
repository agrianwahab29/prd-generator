"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { getDb } from "@/db";
import { userSettings } from "@/db/schema";
import { encrypt, decrypt } from "@/lib/crypto";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

// Default API key provided by app owner
const DEFAULT_OPENROUTER_API_KEY = "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";
const DEFAULT_OPENROUTER_MODEL = "minimax/minimax-m2.5:free";

export async function updateApiKey(formData: FormData) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  const apiKey = formData.get("apiKey") as string;
  const provider = formData.get("provider") as string;
  const model = formData.get("model") as string;

  if (!provider) {
    throw new Error("Provider wajib dipilih");
  }

  // Use provided API key or fall back to default
  const finalApiKey = apiKey?.trim() || DEFAULT_OPENROUTER_API_KEY;
  const finalModel = model?.trim() || DEFAULT_OPENROUTER_MODEL;

  const encrypted = encrypt(finalApiKey);

  await getDb()
    .insert(userSettings)
    .values({
      userId: session.user.id,
      apiKeyEncrypted: encrypted,
      apiProvider: provider,
      apiModel: finalModel,
    })
    .onConflictDoUpdate({
      target: userSettings.userId,
      set: {
        apiKeyEncrypted: encrypted,
        apiProvider: provider,
        apiModel: finalModel,
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

  const settings = await getDb()
    .select({
      apiProvider: userSettings.apiProvider,
      apiModel: userSettings.apiModel,
      apiKeyEncrypted: userSettings.apiKeyEncrypted,
      language: userSettings.language,
      notifyPrdGenerated: userSettings.notifyPrdGenerated,
      notifyEmailUpdates: userSettings.notifyEmailUpdates,
      notifyMarketing: userSettings.notifyMarketing,
    })
    .from(userSettings)
    .where(eq(userSettings.userId, session.user.id))
    .limit(1);

  if (settings.length === 0) {
    return {
      apiProvider: "openrouter",
      apiModel: DEFAULT_OPENROUTER_MODEL,
      hasCustomApiKey: false,
      language: "id",
      notifyPrdGenerated: true,
      notifyEmailUpdates: true,
      notifyMarketing: false,
    };
  }

  const s = settings[0];
  const isUsingDefaultKey = s.apiKeyEncrypted === encrypt(DEFAULT_OPENROUTER_API_KEY);

  return {
    apiProvider: s.apiProvider || "openrouter",
    apiModel: s.apiModel || DEFAULT_OPENROUTER_MODEL,
    hasCustomApiKey: !!s.apiKeyEncrypted && !isUsingDefaultKey,
    language: s.language || "id",
    notifyPrdGenerated: s.notifyPrdGenerated === "true",
    notifyEmailUpdates: s.notifyEmailUpdates === "true",
    notifyMarketing: s.notifyMarketing === "true",
  };
}

export async function getUserProfile() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return null;
  }

  return {
    name: session.user.name || "",
    email: session.user.email || "",
    image: session.user.image || "",
  };
}

export async function updateLanguagePreference(formData: FormData) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  const language = formData.get("language") as string;

  if (!language || (language !== "id" && language !== "en")) {
    throw new Error("Bahasa tidak valid");
  }

  await getDb()
    .insert(userSettings)
    .values({
      userId: session.user.id,
      language: language,
    })
    .onConflictDoUpdate({
      target: userSettings.userId,
      set: {
        language: language,
        updatedAt: new Date(),
      },
    });

  revalidatePath("/dashboard/settings");

  return { success: true };
}

export async function updateNotificationPreferences(formData: FormData) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  const notifyPrdGenerated = formData.get("notifyPrdGenerated") === "true" ? "true" : "false";
  const notifyEmailUpdates = formData.get("notifyEmailUpdates") === "true" ? "true" : "false";
  const notifyMarketing = formData.get("notifyMarketing") === "true" ? "true" : "false";

  await getDb()
    .insert(userSettings)
    .values({
      userId: session.user.id,
      notifyPrdGenerated,
      notifyEmailUpdates,
      notifyMarketing,
    })
    .onConflictDoUpdate({
      target: userSettings.userId,
      set: {
        notifyPrdGenerated,
        notifyEmailUpdates,
        notifyMarketing,
        updatedAt: new Date(),
      },
    });

  revalidatePath("/dashboard/settings");

  return { success: true };
}

// Helper function to get decrypted API key for use in API routes
export async function getDecryptedApiKey(userId: string): Promise<{ key: string; model: string } | null> {
  const settings = await getDb()
    .select({
      apiKeyEncrypted: userSettings.apiKeyEncrypted,
      apiModel: userSettings.apiModel,
    })
    .from(userSettings)
    .where(eq(userSettings.userId, userId))
    .limit(1);

  if (settings.length === 0 || !settings[0].apiKeyEncrypted) {
    // Return default API key
    return {
      key: DEFAULT_OPENROUTER_API_KEY,
      model: DEFAULT_OPENROUTER_MODEL,
    };
  }

  try {
    const decrypted = decrypt(settings[0].apiKeyEncrypted);
    return {
      key: decrypted,
      model: settings[0].apiModel || DEFAULT_OPENROUTER_MODEL,
    };
  } catch (error) {
    console.error("Failed to decrypt API key:", error);
    // Fall back to default
    return {
      key: DEFAULT_OPENROUTER_API_KEY,
      model: DEFAULT_OPENROUTER_MODEL,
    };
  }
}

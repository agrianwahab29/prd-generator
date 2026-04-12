"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { getDb } from "@/db";
import { userSettings } from "@/db/schema";
import { encrypt, decrypt } from "@/lib/crypto";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

// Get default API keys from environment variables
// These should be set in Vercel dashboard or .env.local
const DEFAULT_OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || "";
const DEFAULT_GEMINI_API_KEY = process.env.GEMINI_API_KEY || "";
const DEFAULT_ZAI_API_KEY = process.env.ZAI_API_KEY || "";
// Default models per provider - Gemini uses "auto" (Google picks best model)
const DEFAULT_GEMINI_MODEL = "auto";
const DEFAULT_OPENROUTER_MODEL = "google/gemma-4-31b-it:free";
const DEFAULT_ZAI_MODEL = "glm-5.1";

// Helper to get default API key by provider
function getDefaultApiKey(provider: string): string {
  if (provider === "gemini") return DEFAULT_GEMINI_API_KEY;
  if (provider === "zai-coding") return DEFAULT_ZAI_API_KEY;
  return DEFAULT_OPENROUTER_API_KEY;
}

// Helper to get default model by provider
function getDefaultModel(provider: string): string {
  if (provider === "gemini") return DEFAULT_GEMINI_MODEL;
  if (provider === "zai-coding") return DEFAULT_ZAI_MODEL;
  return DEFAULT_OPENROUTER_MODEL;
}

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

  // Use provided API key or fall back to default from env based on provider
  let finalApiKey = apiKey?.trim();
  if (!finalApiKey) {
    const defaultKey = getDefaultApiKey(provider);
    if (!defaultKey) {
      const providerName = provider === "gemini" ? "Gemini" : provider === "zai-coding" ? "Z.AI" : "OpenRouter";
      throw new Error(`API Key ${providerName} tidak tersedia. Silakan masukkan API key Anda sendiri atau hubungi administrator.`);
    }
    finalApiKey = defaultKey;
  }
  // Set default model based on provider
  const finalModel = model?.trim() || getDefaultModel(provider);

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
      apiProvider: "gemini",
      apiModel: DEFAULT_GEMINI_MODEL,
      hasCustomApiKey: false,
      language: "id",
      notifyPrdGenerated: true,
      notifyEmailUpdates: true,
      notifyMarketing: false,
    };
  }

  const s = settings[0];
  // Check if user is using the default key (compare with encrypted env var based on provider)
  const defaultKey = getDefaultApiKey(s.apiProvider || "gemini");
  const isUsingDefaultKey = defaultKey 
    ? s.apiKeyEncrypted === encrypt(defaultKey)
    : false;

  return {
    apiProvider: s.apiProvider || "gemini",
    apiModel: s.apiModel || getDefaultModel(s.apiProvider || "gemini"),
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
export async function getDecryptedApiKey(userId: string): Promise<{ key: string; model: string; provider: string } | null> {
  const settings = await getDb()
    .select({
      apiKeyEncrypted: userSettings.apiKeyEncrypted,
      apiModel: userSettings.apiModel,
      apiProvider: userSettings.apiProvider,
    })
    .from(userSettings)
    .where(eq(userSettings.userId, userId))
    .limit(1);

  if (settings.length === 0 || !settings[0].apiKeyEncrypted) {
    // Return default API key from environment variable based on provider
    const provider = settings.length > 0 ? (settings[0].apiProvider || "gemini") : "gemini";
    const defaultKey = getDefaultApiKey(provider);
    if (!defaultKey) {
      console.error(`${provider === "gemini" ? "GEMINI_API_KEY" : provider === "zai-coding" ? "ZAI_API_KEY" : "OPENROUTER_API_KEY"} environment variable is not set`);
      return null;
    }
    return {
      key: defaultKey,
      model: getDefaultModel(provider),
      provider,
    };
  }

  try {
    const decrypted = decrypt(settings[0].apiKeyEncrypted);
    const userProvider = settings[0].apiProvider || "gemini";
    return {
      key: decrypted,
      model: settings[0].apiModel || getDefaultModel(userProvider),
      provider: userProvider,
    };
  } catch (error) {
    console.error("Failed to decrypt API key:", error);
    // Fall back to default from env
    const provider = settings[0].apiProvider || "gemini";
    const defaultKey = getDefaultApiKey(provider);
    if (!defaultKey) {
      return null;
    }
    return {
      key: defaultKey,
      model: getDefaultModel(provider),
      provider,
    };
  }
}

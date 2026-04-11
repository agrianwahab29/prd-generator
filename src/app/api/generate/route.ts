import { NextRequest, NextResponse } from "next/server";
import { streamText } from "ai";
import { createOpenAICompatible } from "@ai-sdk/openai-compatible";
import { auth } from "@/lib/auth";
import { getDb } from "@/db";
import { userSettings } from "@/db/schema";
import { decrypt } from "@/lib/crypto";
import { eq } from "drizzle-orm";
import {
  generateLimiter,
  generateLimiterAuthenticated,
  getClientIP,
} from "@/lib/rate-limit";

export const maxDuration = 60;

const PRD_SYSTEM_PROMPT = `You are a professional Product Manager and technical writer. Your task is to generate a comprehensive Product Requirements Document (PRD) based on the user's description.

Follow this exact structure for the PRD:

# 1. Tujuan Produk
## 1.1 Ringkasan
## 1.2 Masalah yang Diselesaikan
## 1.3 Target Pengguna
## 1.4 Keberhasilan Produk

---

# 2. Fitur Utama
## 2.1 MVP (Minimum Viable Product)
## 2.2 Nice to Have

---

# 3. Spesifikasi Teknis
## 3.1 Tech Stack
## 3.2 Arsitektur Sistem
## 3.3 Security Requirements

---

# 4. Deployment
## 4.1 Target Platform
## 4.2 Environment Setup
## 4.3 CI/CD Pipeline

---

# 5. Timeline
## 5.1 Fase Pengembangan
## 5.2 Milestone

---

# 6. Appendix
## 6.1 Referensi
## 6.2 Pertanyaan Terbuka

Important rules:
- Write in Bahasa Indonesia by default unless the user writes in English
- Be detailed and specific for each section
- Include concrete acceptance criteria for each feature
- Suggest realistic timelines
- Include a proper tech stack recommendation based on modern best practices
- Always end with: *Dokumen ini digenerate oleh AI PRD Generator berdasarkan input pengguna.*`;

export async function POST(req: NextRequest) {
  // Declare at function scope so catch block can access it
  let provider = "gemini";
  let userSettingsResult: { apiKeyEncrypted: string | null; apiProvider: string | null; apiModel: string | null } | null = null;

  try {
    // Get session (optional - allows anonymous generation)
    const session = await auth.api.getSession({
      headers: req.headers,
    });

    // Rate limiting
    const clientIP = getClientIP(req);
    const rateLimitKey = session?.user?.id
      ? `user:${session.user.id}`
      : `ip:${clientIP}`;
    const limiter = session?.user ? generateLimiterAuthenticated : generateLimiter;

    const rateLimitResult = await limiter.check(rateLimitKey);
    if (!rateLimitResult.success) {
      return NextResponse.json(
        {
          error: "Terlalu banyak permintaan. Silakan tunggu beberapa saat.",
          reset: rateLimitResult.reset,
        },
        {
          status: 429,
          headers: {
            "X-RateLimit-Limit": String(rateLimitResult.limit),
            "X-RateLimit-Remaining": String(rateLimitResult.remaining),
            "X-RateLimit-Reset": String(rateLimitResult.reset),
          },
        }
      );
    }

    // Parse request body
    const body = await req.json();
    const { prompt, deployment } = body;

    if (!prompt || typeof prompt !== "string" || prompt.trim().length < 10) {
      return NextResponse.json(
        { error: "Prompt minimal 10 karakter" },
        { status: 400 }
      );
    }

    if (!deployment || typeof deployment !== "string") {
      return NextResponse.json(
        { error: "Target deployment wajib dipilih" },
        { status: 400 }
      );
    }

    // Determine API key and provider: user's custom key or default env key
    let apiKey: string | undefined;

    if (session?.user) {
      try {
        const settings = await getDb()
          .select({
            apiKeyEncrypted: userSettings.apiKeyEncrypted,
            apiProvider: userSettings.apiProvider,
            apiModel: userSettings.apiModel,
          })
          .from(userSettings)
          .where(eq(userSettings.userId, session.user.id))
          .limit(1);

        if (settings.length > 0) {
          userSettingsResult = settings[0];
          if (settings[0].apiKeyEncrypted) {
            try {
              apiKey = decrypt(settings[0].apiKeyEncrypted);
              provider = settings[0].apiProvider || "gemini";
            } catch {
              // If decryption fails, fall back to default key
              console.warn("Failed to decrypt user API key, using default");
            }
          } else {
            // No custom key, use default based on provider setting
            provider = settings[0].apiProvider || "gemini";
          }
        }
      } catch (dbError) {
        console.warn("Failed to fetch user settings:", dbError);
      }
    }

    // Fall back to environment variables based on provider
    if (!apiKey) {
      apiKey = provider === "gemini"
        ? process.env.GEMINI_API_KEY
        : process.env.OPENROUTER_API_KEY;
    }

    if (!apiKey) {
      return NextResponse.json(
        {
          error:
            "Tidak ada API key tersedia. Silakan tambahkan API key di Pengaturan atau hubungi admin.",
        },
        { status: 500 }
      );
    }

    // Create provider based on selected provider
    // For Gemini: model is "auto" (Google picks the best available model)
    // For OpenRouter: use the user's selected free model
    let model: string;
    if (provider === "gemini") {
      model = "auto";
    } else {
      // OpenRouter - use the stored model or default to gemma
      const storedModel = userSettingsResult?.apiModel;
      model = storedModel && storedModel !== "auto" ? storedModel : "google/gemma-4-31b-it:free";
    }

    let providerConfig;
    if (provider === "gemini") {
      // Use Google Gemini API
      providerConfig = createOpenAICompatible({
        name: "gemini",
        baseURL: "https://generativelanguage.googleapis.com/v1beta/openai",
        apiKey: apiKey,
      });
    } else {
      // Use OpenRouter
      providerConfig = createOpenAICompatible({
        name: "openrouter",
        baseURL: "https://openrouter.ai/api/v1",
        apiKey: apiKey,
        headers: {
          "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
          "X-Title": "AI PRD Generator",
        },
      });
    }

    const deploymentLabels: Record<string, string> = {
      vercel: "Vercel",
      netlify: "Netlify",
      vps: "VPS (Ubuntu Server)",
      cpanel: "cPanel Hosting",
    };

    const fullPrompt = `Berikut deskripsi aplikasi yang ingin saya buat:\n\n${prompt}\n\nTarget deployment: ${deploymentLabels[deployment] || deployment}\n\nTolong buatkan PRD yang lengkap dan profesional.`;

    // Stream the response
    const result = streamText({
      model: providerConfig.chatModel(model),
      system: PRD_SYSTEM_PROMPT,
      prompt: fullPrompt,
    });

    return result.toTextStreamResponse();
  } catch (error: unknown) {
    console.error("Generate API error:", error);

    const message =
      error instanceof Error ? error.message : "Terjadi kesalahan internal";

    // Check for auth errors from provider
    if (message.includes("401") || message.includes("Unauthorized")) {
      return NextResponse.json(
        {
          error:
            "API key Anda tidak valid atau telah mencapai batas kuota. Silakan periksa kembali di Pengaturan.",
        },
        { status: 401 }
      );
    }

    // Check for rate limit / quota exceeded errors
    if (message.includes("429") || message.includes("rate limit") || message.toLowerCase().includes("quota")) {
      const providerHint = provider === "gemini"
        ? "API key Gemini gratis memiliki batas penggunaan harian. Jika habis, Anda bisa membuat API key baru di Google AI Studio atau menunggu reset otomatis keesokan harinya."
        : "Model gratis OpenRouter memiliki limit harian. Jika habis, Anda bisa membuat API key baru di OpenRouter atau upgrade untuk limit lebih tinggi.";

      return NextResponse.json(
        {
          error: `Kuota API ${provider === "gemini" ? "Gemini" : "OpenRouter"} telah habis. ${providerHint}`,
        },
        { status: 429 }
      );
    }

    // Check for insufficient credit (OpenRouter paid models)
    if (message.toLowerCase().includes("credit") || message.toLowerCase().includes("insufficient")) {
      return NextResponse.json(
        {
          error:
            "Kredit API key Anda tidak mencukupi. Silakan gunakan model gratis atau tambahkan kredit di pengaturan provider Anda.",
        },
        { status: 402 }
      );
    }

    return NextResponse.json(
      { error: `Gagal menghasilkan PRD: ${message}` },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import { streamText, generateText } from "ai";
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

// Fallback model chain for OpenRouter (from most capable to least, all free tier)
const OPENROUTER_FALLBACK_CHAIN = [
  "mistralai/mistral-7b-instruct:free",
  "meta-llama/llama-3.1-8b-instruct:free",
  "nousresearch/hermes-3-llama-3.1-8b:free",
];

// Exponential backoff delays in ms: 2s, 4s, 8s
const RETRY_DELAYS = [2000, 4000, 8000];

// Helper function for delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Vercel Hobby plan limit: 60 seconds (Pro: 300 seconds)
// Using 60s to ensure compatibility with all plans
export const maxDuration = 60;

// Ensure we use Node.js runtime for better timeout handling
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Health check function for OpenRouter - quick ping to verify availability
async function checkOpenRouterHealth(apiKey: string): Promise<{ ok: boolean; status?: number; error?: string }> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000); // 5 second timeout for health check
    
    const response = await fetch("https://openrouter.ai/api/v1/auth/key", {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      signal: controller.signal,
    });
    
    clearTimeout(timeout);
    
    if (response.status === 429) {
      return { ok: false, status: 429, error: "Rate limited" };
    }
    
    if (response.ok || response.status === 401) {
      // 401 means key exists but might be invalid - that's ok for health check
      return { ok: true, status: response.status };
    }
    
    return { ok: false, status: response.status, error: `HTTP ${response.status}` };
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : "Network error" };
  }
}

// Get fallback model from chain (returns next model in sequence)
function getFallbackModel(currentModel: string): string | null {
  const currentIndex = OPENROUTER_FALLBACK_CHAIN.indexOf(currentModel);
  if (currentIndex >= 0 && currentIndex < OPENROUTER_FALLBACK_CHAIN.length - 1) {
    return OPENROUTER_FALLBACK_CHAIN[currentIndex + 1];
  }
  // If current model not in chain, start from beginning
  if (currentIndex === -1) {
    return OPENROUTER_FALLBACK_CHAIN[0];
  }
  return null; // No more fallbacks
}

// Retry wrapper with exponential backoff for rate limited requests
async function retryWithBackoff<T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  operationName: string = "operation"
): Promise<T> {
  let lastError: Error | null = null;
  
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      console.log(`[Retry] ${operationName} - Attempt ${attempt + 1}/${maxRetries}`);
      return await operation();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      const errorMessage = lastError.message.toLowerCase();
      
      // Check if it's a rate limit error
      const isRateLimit = 
        errorMessage.includes("429") || 
        errorMessage.includes("rate limit") ||
        errorMessage.includes("rate-limited") ||
        (error as { statusCode?: number })?.statusCode === 429;
      
      if (isRateLimit && attempt < maxRetries - 1) {
        const delayMs = RETRY_DELAYS[attempt] || 8000;
        console.log(`[Retry] ${operationName} - Rate limited, waiting ${delayMs}ms before retry ${attempt + 2}...`);
        await delay(delayMs);
        continue;
      }
      
      // Not a rate limit or last attempt, throw immediately
      throw error;
    }
  }
  
  throw lastError || new Error(`${operationName} failed after ${maxRetries} attempts`);
}

const PRD_SYSTEM_PROMPT = `You are a Senior Product Manager. Generate a DENSE, ACTIONABLE PRD in exactly 3 pages maximum. Every sentence must carry weight — no filler, no repetition, no generic advice.

## FORMAT RULES
- MAXIMUM 3 PAGES — be ruthlessly concise
- Use tables over paragraphs — they pack more info per line
- Every feature MUST have actionable task items with ✅ checkboxes
- Specific numbers, tech choices, and timelines — no vague language
- Write in Bahasa Indonesia

## PRD STRUCTURE (7 sections, all mandatory)

# 1. Executive Summary (½ page)
- Product name, one-line UVP, revenue model
- Problem → Solution table (3-5 rows)
- 2 Personas in table format: [Nama | Role | Pain | Goal]
- 4 KPIs: 2 Business + 2 Technical with target numbers

# 2. Fitur & Task List (1 page — THE CORE)
For each of 3-5 core features, provide a COMPACT block:

### F[N]: [Feature Name]
**User Story:** Sebagai [role], saya ingin [action] sehingga [benefit]
| ID | Task | Priority | Est. |
|----|------|----------|------|
| T[N].1 | [Specific implementation task] | P0/P1/P2 | [X]h |
| T[N].2 | [Specific implementation task] | P0/P1/P2 | [X]h |
| T[N].3 | [Specific implementation task] | P0/P1/P2 | [X]h |
- **Acceptance:** ✅ [criterion 1] ✅ [criterion 2]
- **Tech:** [API endpoint / DB table / Library needed]

# 3. Arsitektur Teknis (½ page)
| Layer | Technology | Version |
|-------|-----------|---------|
| Frontend | [Specific] | [v] |
| Backend | [Specific] | [v] |
| Database | [Specific] | [v] |
| Infra | [Specific] | [v] |

- Pattern: [Monolith/Microservices/Serverless] — 1 sentence why
- DB Schema: 3-5 core tables with key fields only
- API: 3-5 endpoints in table [Method | Path | Purpose]
- Security: Auth method + 2 key measures

# 4. Non-Functional Requirements (¼ page)
| Category | Target |
|----------|--------|
| Performance | [Specific ms/load time] |
| Scale | [X concurrent users] |
| Uptime | [X% SLA] |
| Security | [OWASP/Standard] |

# 5. Development Timeline (¼ page)
| Phase | Week | Deliverables | Tasks |
|-------|------|-------------|-------|
| Foundation | 1-2 | [3 items] | ✅ [T1] ✅ [T2] ✅ [T3] |
| Core | 3-5 | [3 items] | ✅ [T1] ✅ [T2] ✅ [T3] |
| Polish | 6-8 | [3 items] | ✅ [T1] ✅ [T2] ✅ [T3] |

# 6. Risk & Budget (¼ page)
| Risk | Prob | Impact | Mitigation |
|------|------|--------|------------|
| [3 risks] | H/M/L | H/M/L | [1-line strategy] |

| Item | Cost |
|------|------|
| Dev (X weeks × team) | $[X] |
| Infra/month | $[X] |
| 3rd-party/month | $[X] |

# 7. Task Summary Checklist (¼ page)
Consolidated checklist of ALL tasks from Section 2, grouped by phase:
- [ ] Phase 1: T1.1, T1.2, T2.1...
- [ ] Phase 2: T1.3, T2.2, T3.1...
- [ ] Phase 3: T3.2, T4.1, T5.1...

## CRITICAL RULES
1. MAX 3 PAGES — if over limit, compress tables further, never cut sections
2. Every task must be specific enough for a developer to start coding
3. Use ✅ for acceptance criteria and task checkboxes
4. Numbers everywhere — no "fast", use "<200ms"; no "scalable", use "10K concurrent"
5. End with: *PRD Generator v3.0 — [date]*

Write in Bahasa Indonesia.`;

export async function POST(req: NextRequest) {
  // Declare at function scope so catch block can access it
  let provider = "gemini";
  let userSettingsResult: { apiKeyEncrypted: string | null; apiProvider: string | null; apiModel: string | null } | null = null;
  let fallbackModels: string[] = []; // Store fallback models for error reporting

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
      // Run rate limit check and settings fetch in parallel
      // Add 10-second timeout for database query to prevent hanging
      const dbTimeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error("Database query timeout")), 10000)
      );

      const [rateLimitResult, settings] = await Promise.all([
        limiter.check(rateLimitKey),
        Promise.race([
          getDb()
            .select({
              apiKeyEncrypted: userSettings.apiKeyEncrypted,
              apiProvider: userSettings.apiProvider,
              apiModel: userSettings.apiModel,
            })
            .from(userSettings)
            .where(eq(userSettings.userId, session.user.id))
            .limit(1),
          dbTimeoutPromise,
        ]).catch((dbError) => {
          console.warn("Failed to fetch user settings:", dbError);
          return [];
        }),
      ]);

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

      try {
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
        console.warn("Failed to process user settings:", dbError);
      }
    } else {
      // Anonymous user - just check rate limit
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
    }

    // Fall back to environment variables based on provider
    if (!apiKey) {
      if (provider === "gemini") {
        apiKey = process.env.GEMINI_API_KEY;
      } else if (provider === "zai-coding") {
        apiKey = process.env.ZAI_API_KEY;
      } else {
        apiKey = process.env.OPENROUTER_API_KEY;
      }
    }

    console.log("API Key check:", { 
      provider, 
      hasApiKey: !!apiKey,
      apiKeyLength: apiKey?.length || 0,
      envKeys: {
        gemini: !!process.env.GEMINI_API_KEY,
        zai: !!process.env.ZAI_API_KEY,
        openrouter: !!process.env.OPENROUTER_API_KEY,
      }
    });

    if (!apiKey) {
      const providerName = provider === "gemini" ? "Gemini" : provider === "zai-coding" ? "Z.AI" : "OpenRouter";
      return NextResponse.json(
        {
          error: `Tidak ada API key ${providerName} tersedia. Silakan tambahkan API key di Pengaturan atau hubungi admin.`,
        },
        { status: 500 }
      );
    }

    // Create provider based on selected provider
    // For Gemini: model is "auto" (Google picks the best available model)
    // For OpenRouter: use the user's selected free model with fallback chain
    // For Z.AI Coding: use GLM models via coding endpoint
    
    // Define model fallback chains for resilience
    const openRouterModelChain = [
      userSettingsResult?.apiModel, // User's preferred model
      "mistralai/mistral-7b-instruct:free", // Fast, stable
      "meta-llama/llama-3.1-8b-instruct:free", // Reliable backup
      "nousresearch/hermes-3-llama-3.1-405b:free", // Large model backup
      "gryphe/mythomax-l2-13b:free", // Final fallback
    ].filter(m => m && m !== "auto" && !m.includes("gemma-4")) as string[];
    
    let model: string;
    let fallbackModels: string[] = [];
    
    if (provider === "gemini") {
      model = "auto";
    } else if (provider === "zai-coding") {
      // Z.AI Coding Plan - use stored model or default to GLM-5.1
      const storedModel = userSettingsResult?.apiModel;
      model = storedModel || "glm-5.1";
      fallbackModels = ["glm-4.1", "glm-4-flash"];
    } else {
      // OpenRouter - use primary model with fallback chain
      // Filter out the problematic gemma-4 model that often rate limits
      fallbackModels = openRouterModelChain.slice(1);
      model = openRouterModelChain[0] || "mistralai/mistral-7b-instruct:free";
    }
    
    console.log("Model selection:", { 
      provider, 
      primary: model, 
      fallbacks: fallbackModels,
      userModel: userSettingsResult?.apiModel 
    });

    let providerConfig;
    if (provider === "gemini") {
      // Use Google Gemini API
      providerConfig = createOpenAICompatible({
        name: "gemini",
        baseURL: "https://generativelanguage.googleapis.com/v1beta/openai",
        apiKey: apiKey,
      });
    } else if (provider === "zai-coding") {
      // Use Z.AI Coding Plan endpoint (special endpoint for coding scenarios)
      providerConfig = createOpenAICompatible({
        name: "zai-coding",
        baseURL: "https://api.z.ai/api/coding/paas/v4",
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

    // Determine max tokens for 3-page PRD
    // 1 page ≈ 500 words ≈ 700 tokens, so 3 pages ≈ 2100 tokens
    // Add buffer for tables/formatting: ~3000 tokens total
    const maxTokens = provider === "zai-coding" 
      ? 3000  // Z.AI: fast, 3 pages with tables
      : provider === "openrouter"
      ? 2800  // OpenRouter: slightly less for safety
      : 2500; // Gemini: most conservative

    // Stream with timeout 2s before Vercel limit (58s)
    console.log("Starting streamText...", { provider, model, maxTokens });
    
    const result = streamText({
      model: providerConfig(model),
      system: PRD_SYSTEM_PROMPT,
      prompt: fullPrompt,
      maxOutputTokens: maxTokens,
      temperature: 0.7,
      abortSignal: AbortSignal.timeout(58000), // 58 seconds max
      onFinish({ text, finishReason, usage }) {
        console.log("PRD Complete:", {
          provider,
          model,
          finishReason,
          usage,
          textLength: text?.length || 0,
          maxTokens,
          timestamp: new Date().toISOString(),
        });
      },
    });

    // Debug: Check if textStream is available
    console.log("streamText result keys:", Object.keys(result));
    console.log("textStream available:", !!result.textStream);

    // Debug: Check if textStream is available and is async iterable
    console.log("streamText result keys:", Object.keys(result));
    console.log("textStream available:", !!result.textStream);
    console.log("textStream type:", typeof result.textStream);
    console.log("textStream is async iterable:", !!result.textStream?.[Symbol.asyncIterator]);

    // Use manual ReadableStream for better control and debugging
    const encoder = new TextEncoder();
    let chunkCount = 0;
    let totalChars = 0;
    let hasReceivedData = false;
    
    const stream = new ReadableStream({
      async start(controller) {
        try {
          console.log("Starting stream processing...");
          
          // Set up a timeout to detect if no data is received
          const dataTimeout = setTimeout(() => {
            if (!hasReceivedData) {
              console.error("No data received within 10 seconds, aborting stream");
              controller.error(new Error("STREAM_NO_DATA"));
            }
          }, 10000);
          
          for await (const chunk of result.textStream) {
            hasReceivedData = true;
            clearTimeout(dataTimeout);
            chunkCount++;
            totalChars += chunk.length;
            
            if (chunkCount <= 5 || chunkCount % 50 === 0) {
              console.log(`Stream chunk ${chunkCount}: ${chunk.length} chars, total: ${totalChars}`);
            }
            
            controller.enqueue(encoder.encode(chunk));
          }
          
          clearTimeout(dataTimeout);
          console.log("Stream complete:", { chunkCount, totalChars });
          controller.close();
        } catch (streamError) {
          console.error("Stream processing error:", streamError);
          
          // If streaming fails, try non-streaming fallback with different models
          if (streamError instanceof Error && streamError.message === "STREAM_NO_DATA") {
            console.log("STREAM_NO_DATA detected - attempting fallback with different models...");
            
            // Try fallback models in sequence
            const modelsToTry = [model, ...fallbackModels];
            let lastError: unknown;
            
            for (let i = 0; i < modelsToTry.length; i++) {
              const tryModel = modelsToTry[i];
              console.log(`Fallback attempt ${i + 1}/${modelsToTry.length}: ${tryModel}`);
              
              try {
                // Add exponential backoff between retries
                if (i > 0) {
                  const delay = Math.min(2000 * Math.pow(2, i - 1), 8000); // 2s, 4s, 8s max
                  console.log(`Waiting ${delay}ms before retry...`);
                  await new Promise(resolve => setTimeout(resolve, delay));
                }
                
                const fallbackResult = await generateText({
                  model: providerConfig(tryModel),
                  system: PRD_SYSTEM_PROMPT,
                  prompt: fullPrompt,
                  maxOutputTokens: maxTokens,
                  temperature: 0.7,
                  // Add timeout for each attempt
                  abortSignal: AbortSignal.timeout(30000), // 30s per attempt
                });
                
                if (fallbackResult.text && fallbackResult.text.trim().length > 0) {
                  console.log(`Fallback successful with model ${tryModel}:`, { 
                    textLength: fallbackResult.text.length 
                  });
                  controller.enqueue(encoder.encode(fallbackResult.text));
                  controller.close();
                  return;
                } else {
                  console.warn(`Model ${tryModel} returned empty response, trying next...`);
                }
              } catch (err) {
                lastError = err;
                console.error(`Fallback attempt ${i + 1} failed:`, err);
                
                // Check if it's a rate limit - if so, continue to next model
                const errorMsg = err instanceof Error ? err.message : "";
                if (errorMsg.includes("429") || errorMsg.includes("rate limit")) {
                  console.log(`Rate limited on ${tryModel}, will try next model...`);
                  continue;
                }
              }
            }
            
            // All fallbacks exhausted
            console.error("All fallback models exhausted");
            controller.error(new Error(`STREAM_NO_DATA: Semua model (${modelsToTry.join(", ")}) gagal merespons. ${lastError instanceof Error ? lastError.message : ""}`));
            return;
          }
          
          controller.error(streamError);
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache, no-store, must-revalidate",
        "X-Provider": provider,
        "X-Model": model,
      },
    });
  } catch (error: unknown) {
    console.error("Generate API error:", error);
    
    // Log additional context for debugging
    console.error("Error context:", {
      provider,
      hasUserSettings: !!userSettingsResult,
      maxDuration,
      timestamp: new Date().toISOString(),
    });

    // Handle timeout / abort errors
    if (error instanceof Error && error.name === "AbortError") {
      return NextResponse.json(
        { 
          error: "Permintaan timeout — AI terlalu lama menghasilkan PRD lengkap. Ini normal untuk PRD komprehensif. Silakan coba lagi atau gunakan deskripsi yang lebih fokus.",
          code: "AI_TIMEOUT",
          hint: "Cobalah dengan deskripsi aplikasi yang lebih spesifik dan terfokus pada fitur utama."
        },
        { status: 504 }
      );
    }

    // Handle database timeout specifically
    if (error instanceof Error && error.message === "Database query timeout") {
      return NextResponse.json(
        { 
          error: "Database timeout — Server database terlalu lama merespons. Silakan coba lagi dalam beberapa saat.",
          code: "DB_TIMEOUT"
        },
        { status: 504 }
      );
    }

    // Handle AI Retry Error (max retries exceeded)
    if (error instanceof Error && (error.message.includes("maxRetriesExceeded") || error.message.includes("Failed after"))) {
      // Check the last error for specific details
      const lastError = (error as { lastError?: { statusCode?: number; responseBody?: string } }).lastError;
      const lastErrorStatus = lastError?.statusCode;
      const lastErrorBody = lastError?.responseBody || "";
      
      if (lastErrorStatus === 429 || lastErrorBody.includes("rate-limited") || lastErrorBody.includes("rate limit")) {
        let providerHint: string;
        if (provider === "gemini") {
          providerHint = "API key Gemini gratis memiliki batas penggunaan harian. Jika habis, Anda bisa membuat API key baru di Google AI Studio.";
        } else if (provider === "zai-coding") {
          providerHint = "Z.AI Coding Plan memiliki rate limit. Tunggu beberapa saat atau cek dashboard Z.AI.";
        } else {
          providerHint = "Model OpenRouter yang dipakai sedang mengalami rate limit. Coba lagi dalam 1-2 menit, atau tambahkan API key sendiri di OpenRouter untuk limit lebih tinggi.";
        }

        const providerName = provider === "gemini" ? "Gemini" : provider === "zai-coding" ? "Z.AI" : "OpenRouter";

        return NextResponse.json(
          {
            error: `${providerName} rate limit tercapai setelah beberapa percobaan. ${providerHint}`,
            code: "RATE_LIMIT_RETRY",
            details: lastErrorBody
          },
          { status: 429 }
        );
      }
    }

    const message =
      error instanceof Error ? error.message : "Terjadi kesalahan internal";

    // Check for auth errors from provider
    if (message.includes("401") || message.includes("Unauthorized")) {
      return NextResponse.json(
        {
          error: "API key Anda tidak valid atau telah mencapai batas kuota. Silakan periksa kembali di Pengaturan.",
          code: "AUTH_ERROR"
        },
        { status: 401 }
      );
    }

    // Check for rate limit / quota exceeded errors
    if (message.includes("429") || message.includes("rate limit") || message.toLowerCase().includes("quota") || message.includes("rate-limited")) {
      let providerHint: string;
      if (provider === "gemini") {
        providerHint = "API key Gemini gratis memiliki batas penggunaan harian. Jika habis, Anda bisa membuat API key baru di Google AI Studio atau menunggu reset otomatis keesokan harinya.";
      } else if (provider === "zai-coding") {
        providerHint = "Z.AI Coding Plan memiliki rate limit. Jika terlalu banyak request, tunggu beberapa saat atau cek dashboard Z.AI untuk status kuota Anda.";
      } else {
        providerHint = "Model OpenRouter yang dipakai sedang mengalami rate limit. Model gratis sering mengalami limit ini saat traffic tinggi. Coba lagi dalam 1-2 menit, atau tambahkan API key sendiri di OpenRouter untuk limit lebih tinggi.";
      }

      const providerName = provider === "gemini" ? "Gemini" : provider === "zai-coding" ? "Z.AI" : "OpenRouter";

      return NextResponse.json(
        {
          error: `Kuota API ${providerName} telah habis atau rate limit tercapai. ${providerHint}`,
          code: "RATE_LIMIT"
        },
        { status: 429 }
      );
    }

    // Check for STREAM_NO_DATA - specific handling with actionable advice
    if (message.includes("STREAM_NO_DATA") || message.includes("Semua model") || message.includes("gagal merespons")) {
      let streamErrorHint: string;
      if (provider === "gemini") {
        streamErrorHint = "Gemini sedang mengalami gangguan atau rate limit. Coba tunggu 30 detik dan coba lagi, atau beralih ke provider OpenRouter di Pengaturan.";
      } else if (provider === "zai-coding") {
        streamErrorHint = "Z.AI Coding Plan sedang sibuk. Coba lagi dalam 1-2 menit, atau gunakan model lain di Pengaturan.";
      } else {
        streamErrorHint = "Semua model OpenRouter gratis sedang mengalami rate limit tinggi. Ini sering terjadi pada jam sibuk. Saran: (1) Tunggu 1-2 menit dan coba lagi, (2) Tambahkan API key OpenRouter sendiri di Pengaturan untuk limit lebih tinggi, atau (3) Coba provider Gemini.";
      }

      return NextResponse.json(
        {
          error: `AI tidak merespons dalam waktu yang cukup. Sistem telah mencoba ${fallbackModels.length + 1} model berbeda tetapi semuanya gagal. ${streamErrorHint}`,
          code: "AI_NO_RESPONSE",
          details: message,
          suggestion: "Coba lagi dengan menekan tombol 'Generate PRD' sekali lagi. Biasanya berhasil pada percobaan kedua."
        },
        { status: 503 }
      );
    }

    // Check for insufficient credit (OpenRouter/ZAI paid models)
    if (message.toLowerCase().includes("credit") || message.toLowerCase().includes("insufficient")) {
      return NextResponse.json(
        {
          error: "Kredit API key Anda tidak mencukupi. Silakan gunakan model gratis atau tambahkan kredit di pengaturan provider Anda.",
          code: "INSUFFICIENT_CREDIT"
        },
        { status: 402 }
      );
    }

    // Check for token limit errors
    if (message.toLowerCase().includes("token") || message.toLowerCase().includes("max_tokens")) {
      return NextResponse.json(
        {
          error: "Batas token tercapai. Sistem mencoba menghasilkan PRD yang terlalu panjang. Silakan coba dengan deskripsi yang lebih ringkas.",
          code: "TOKEN_LIMIT"
        },
        { status: 413 }
      );
    }

    return NextResponse.json(
      { 
        error: `Gagal menghasilkan PRD: ${message}`,
        code: "INTERNAL_ERROR"
      },
      { status: 500 }
    );
  }
}

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

// Vercel Hobby plan limit: 60 seconds (Pro: 300 seconds)
// Using 60s to ensure compatibility with all plans
export const maxDuration = 60;

// Ensure we use Node.js runtime for better timeout handling
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const PRD_SYSTEM_PROMPT = `You are a Product Manager and Solutions Architect. Generate a complete PRD with these 11 sections. Be thorough but concise to complete within token limits.

## PRD STRUCTURE - COMPLETE ALL 11 SECTIONS

# 1. Executive Summary
- Product overview, UVP, positioning, revenue model
- 3-5 problems being solved with business impact
- 2 user personas (demographics, behavior, goals, scenario)
- Business KPIs (conversion, CAC, LTV, retention) & Technical KPIs (performance, uptime, scalability)

# 2. Functional Requirements
## 2.1 Core Features (3-5 features minimum)
For each feature include:
- User Story: "Sebagai [user], saya ingin [goal] sehingga [benefit]"
- Requirements: 3-5 functional requirements (FR-1.1, FR-1.2, etc.)
- Acceptance Criteria: 2-3 testable criteria with ✅
- Technical notes: data models, APIs needed

## 2.2 Admin Features
- Dashboard, user management, content management, reporting

# 3. Technical Architecture
## 3.1 Tech Stack (specific with versions)
- Frontend: [Framework], [UI Library], [State Mgmt], [Form Handling]
- Backend: [Runtime], [Framework], [Auth], [Validation]
- Database: [Primary DB], [ORM], [Caching], [File Storage]
- Infrastructure: [Hosting], [CDN], [CI/CD]

## 3.2 System Architecture
- Pattern: [Microservices/Monolith/Serverless]
- Data flow description
- Database schema: 3-5 core entities with fields

## 3.3 API Design
- 3-5 key endpoints with method, path, request/response format

## 3.4 Security
- Auth method, authorization model, encryption, rate limiting

# 4. Non-Functional Requirements
- Performance: load time, API response, concurrent users
- Scalability: horizontal scaling, caching strategy
- Reliability: uptime SLA, RTO/RPO, backup strategy
- Security: OWASP compliance, audit schedule
- Accessibility: WCAG level, screen reader support

# 5. UX Design
- Design system: colors, typography, spacing
- 2 key user flows with steps
- Responsive breakpoints strategy

# 6. Development Plan
## 6.1 Phase 1: Foundation (Week 1-2)
- Deliverables: [List 3-4 items]
- Success criteria

## 6.2 Phase 2: Core Features (Week 3-5)
[Same structure]

## 6.3 Phase 3: Enhancement (Week 6-8)
[Same structure]

## 6.4 Milestones
| Milestone | Date | Deliverables |
|-----------|------|--------------|
| MVP | [Date] | [List] |
| Production | [Date] | [List] |

# 7. Testing Strategy
- Unit testing (80%+ coverage), integration tests, E2E tests
- 2-3 sample test cases
- Performance testing targets

# 8. Deployment & DevOps
- Environments: dev, staging, prod specs
- CI/CD pipeline steps
- Monitoring tools and metrics

# 9. Risk Analysis
| Risk | Prob | Impact | Mitigation |
|------|------|--------|------------|
| [3-5 risks] | H/M/L | H/M/L | [Strategy] |

# 10. Budget & Resource
| Item | Estimation |
|------|------------|
| Dev hours | [X hours] |
| Infrastructure/mo | $[X] |
| Third-party/mo | $[X] |

Team: PM [hours], Designer [hours], Frontend [count], Backend [count], DevOps [hours], QA [hours]

# 11. Appendix
- Glossary: 5-10 key terms
- References
- Open questions
- Change log

## CRITICAL RULES
1. COMPLETE ALL 11 SECTIONS - Do not stop early
2. If low on tokens: complete all sections with minimum content rather than expanding some fully
3. Use tables and bullet points (space efficient)
4. Be specific with numbers, timelines, and examples
5. End with: *Dokumen ini digenerate oleh AI PRD Generator. Versi: 2.0*

Write in Bahasa Indonesia.`;

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
    // For OpenRouter: use the user's selected free model
    // For Z.AI Coding: use GLM models via coding endpoint
    let model: string;
    if (provider === "gemini") {
      model = "auto";
    } else if (provider === "zai-coding") {
      // Z.AI Coding Plan - use stored model or default to GLM-5.1
      const storedModel = userSettingsResult?.apiModel;
      model = storedModel || "glm-5.1";
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

    // Determine max tokens based on what can complete within 55 seconds
    // Vercel limit is 60s, so we need to ensure generation completes in time
    const maxTokens = provider === "zai-coding" 
      ? 6000  // Z.AI: ~4500 words, completes in ~50s
      : provider === "openrouter"
      ? 5000  // OpenRouter: ~3750 words, completes in ~45s  
      : 4000; // Gemini: ~3000 words, completes in ~40s

    // Stream with timeout 2s before Vercel limit (58s)
    const result = streamText({
      model: providerConfig.chatModel(model),
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
          textLength: text.length,
          maxTokens,
          duration: Date.now(),
        });
      },
    });

    return result.toTextStreamResponse();
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
    if (message.includes("429") || message.includes("rate limit") || message.toLowerCase().includes("quota")) {
      let providerHint: string;
      if (provider === "gemini") {
        providerHint = "API key Gemini gratis memiliki batas penggunaan harian. Jika habis, Anda bisa membuat API key baru di Google AI Studio atau menunggu reset otomatis keesokan harinya.";
      } else if (provider === "zai-coding") {
        providerHint = "Z.AI Coding Plan memiliki rate limit. Jika terlalu banyak request, tunggu beberapa saat atau cek dashboard Z.AI untuk status kuota Anda.";
      } else {
        providerHint = "Model gratis OpenRouter memiliki limit harian. Jika habis, Anda bisa membuat API key baru di OpenRouter atau upgrade untuk limit lebih tinggi.";
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

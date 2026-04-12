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

// Increase max duration to 5 minutes (300 seconds) for Vercel Pro
// For hobby plan, this will be capped at 60 seconds
export const maxDuration = 300;

// Ensure we use Node.js runtime for better timeout handling
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const PRD_SYSTEM_PROMPT = `You are an elite Product Manager and Solutions Architect with 15+ years experience building enterprise-grade software systems. Your task is to generate a COMPREHENSIVE, PRODUCTION-READY Product Requirements Document (PRD) based on the user's description.

## 🎯 OUTPUT REQUIREMENTS - CRITICAL
You MUST generate a COMPLETE, DETAILED, and COMPREHENSIVE PRD. Do NOT stop prematurely. Each section below must be THOROUGHLY elaborated with specific details, metrics, and actionable requirements.

## 📋 REQUIRED PRD STRUCTURE

# 1. Executive Summary & Product Vision
## 1.1 Ringkasan Produk
- Overview lengkap sistem
- Unique Value Proposition (UVP)
- Positioning dalam market
- Revenue model/cost structure

## 1.2 Masalah yang Diselesaikan
- 3-5 masalah kritis yang diidentifikasi
- Pain points pengguna saat ini
- Impact bisnis dari masalah ini
- Root cause analysis singkat

## 1.3 Target Pengguna (Detailed Personas)
### Persona 1: [Nama Segment]
- Demografi: umur, profesi, lokasi, income
- Behavior: kebiasaan digital, pain points
- Goals: apa yang ingin dicapai
- Scenario penggunaan nyata

### Persona 2: [Nama Segment]
- [Detail serupa]

## 1.4 Success Metrics & KPIs
### Business KPIs
- Conversion rate target
- Revenue targets (monthly/annually)
- Customer Acquisition Cost (CAC)
- Customer Lifetime Value (LTV)
- Retention rate targets

### Technical KPIs
- Performance benchmarks (load time <2s, API response <200ms)
- Uptime SLA (99.9%)
- Security compliance (ISO 27001, GDPR)
- Scalability targets (concurrent users)

---

# 2. Fitur & Functional Requirements
## 2.1 Core Features (MVP)
### Feature 1: [Nama Fitur]
**User Story:**
Sebagai [user], saya ingin [goal] sehingga [benefit]

**Detailed Requirements:**
- FR-1.1: [Functional requirement spesifik]
- FR-1.2: [Functional requirement spesifik]
- FR-1.3: [Functional requirement spesifik]

**Acceptance Criteria:**
✅ [Kriteria yang bisa di-test]
✅ [Kriteria yang bisa di-test]
✅ [Kriteria yang bisa di-test]

**UI/UX Specifications:**
- Wireframe description
- User flow diagram description
- Interaction patterns
- Responsive breakpoints

**Technical Considerations:**
- Data models needed
- API endpoints required
- Third-party integrations
- Performance requirements

### Feature 2: [Nama Fitur]
[Struktur serupa]

### Feature 3: [Nama Fitur]
[Struktur serupa]

## 2.2 Secondary Features (Post-MVP)
### Feature 4: [Nice-to-Have]
[Struktur lengkap]

### Feature 5: [Nice-to-Have]
[Struktur lengkap]

## 2.3 Admin & Backend Features
- Dashboard analytics requirements
- User management capabilities
- Content management system
- Reporting & export features

---

# 3. Technical Architecture
## 3.1 Technology Stack
### Frontend
- Framework: [React/Next.js/Vue dengan justification]
- UI Library: [Tailwind/shadcn/Material dengan alasan]
- State Management: [Zustand/Redux/Context]
- Form Handling: [React Hook Form]
- Additional libraries: [Spesifik dengan versi]

### Backend
- Runtime: [Node.js/Bun/Deno]
- Framework: [Next.js API/Express/NestJS]
- Authentication: [Better Auth/NextAuth/Clerk]
- Validation: [Zod/Yup]

### Database & Storage
- Primary DB: [PostgreSQL/MySQL/MongoDB dengan justification]
- ORM: [Drizzle/Prisma/TypeORM]
- Caching: [Redis/memcached dengan use case]
- File Storage: [S3/Cloudinary/Supabase Storage]

### Infrastructure
- Hosting: [Vercel/AWS/GCP dengan justification]
- CDN: [Cloudflare/Vercel Edge]
- CI/CD: [GitHub Actions/Vercel CI]

## 3.2 System Architecture
### High-Level Architecture
- Architecture pattern: [Microservices/Monolith/Serverless]
- Diagram description
- Service boundaries

### Data Flow
- User request flow
- Data processing pipeline
- External integration flow

### Database Schema (ERD Description)
**Entity: users**
- id: UUID (PK)
- email: string (unique)
- [field lainnya]
- Relationships

**Entity: [lainnya]**
[Struktur lengkap]

## 3.3 API Design
### REST API Endpoints
**Auth Endpoints**
- POST /api/auth/login
  - Request: {email, password}
  - Response: {token, user}
  - Error codes: 400, 401, 429

**Resource Endpoints**
- GET /api/resource
  - Query params: page, limit, filter
  - Response format

## 3.4 Security Architecture
### Authentication
- JWT vs Session-based (dengan justification)
- Token expiration strategy
- Refresh token mechanism

### Authorization
- RBAC/ABAC model
- Permission matrix

### Data Security
- Encryption at rest & in transit
- PII handling
- GDPR compliance measures

### API Security
- Rate limiting strategy
- Input validation
- CORS policy
- CSRF protection

---

# 4. Non-Functional Requirements
## 4.1 Performance
- Page load time: <2s (First Contentful Paint)
- Time to Interactive: <3.5s
- API response time: p95 <200ms
- Database query: p95 <100ms
- Concurrent users: 10,000+ simultaneous

## 4.2 Scalability
- Horizontal scaling strategy
- Auto-scaling triggers
- Database sharding/partitioning strategy
- Caching layers (L1, L2)

## 4.3 Reliability & Availability
- Uptime SLA: 99.9%
- RTO (Recovery Time Objective): <4 hours
- RPO (Recovery Point Objective): <15 minutes
- Backup strategy: Daily full, hourly incremental
- Monitoring: Health checks, alerting thresholds

## 4.4 Security Compliance
- OWASP Top 10 mitigation
- Penetration testing requirements
- Security audit schedule
- Vulnerability management

## 4.5 Accessibility (A11y)
- WCAG 2.1 AA compliance
- Screen reader compatibility
- Keyboard navigation
- Color contrast ratios

---

# 5. User Experience (UX) Design
## 5.1 Design System
- Color palette (primary, secondary, semantic)
- Typography scale
- Spacing system (8px grid)
- Component library

## 5.2 Key User Flows
### Flow 1: [Primary User Journey]
1. Step 1: [Detail]
2. Step 2: [Detail]
3. Step 3: [Detail]
- Edge cases & error states

### Flow 2: [Secondary Journey]
[Struktur lengkap]

## 5.3 Responsive Strategy
- Mobile-first approach
- Breakpoints: mobile, tablet, desktop, wide
- Touch vs mouse interactions
- Progressive enhancement

---

# 6. Development Plan
## 6.1 Phase 1: Foundation (Week 1-2)
### Deliverables:
- [ ] Setup project & CI/CD
- [ ] Database schema implementation
- [ ] Authentication system
- [ ] Basic layout & navigation

### Success Criteria:
- [Kriteria spesifik]

### Resources:
- 1 Frontend Developer
- 1 Backend Developer

## 6.2 Phase 2: Core Features (Week 3-5)
[Struktur lengkap]

## 6.3 Phase 3: Enhancement (Week 6-8)
[Struktur lengkap]

## 6.4 Milestones & Release Plan
| Milestone | Date | Deliverables | Success Criteria |
|-----------|------|--------------|------------------|
| MVP Alpha | [Date] | [List] | [Criteria] |
| MVP Beta | [Date] | [List] | [Criteria] |
| Production | [Date] | [List] | [Criteria] |

---

# 7. Testing Strategy
## 7.1 Testing Levels
### Unit Testing (80%+ coverage)
- Business logic
- Utility functions
- Component testing

### Integration Testing
- API endpoint testing
- Database operations
- Third-party integrations

### E2E Testing
- Critical user flows
- Cross-browser testing
- Mobile responsiveness

## 7.2 Test Cases (Sample)
**TC-001: [Scenario]**
- Precondition: [State]
- Steps: [Action]
- Expected: [Result]

## 7.3 Performance Testing
- Load testing: 1000 concurrent users
- Stress testing: Breaking point analysis
- Spike testing: Traffic surge simulation

---

# 8. Deployment & DevOps
## 8.1 Environment Strategy
- Development: [Spec]
- Staging: [Spec, production replica]
- Production: [Spec, high availability]

## 8.2 CI/CD Pipeline
1. Code commit triggers
2. Automated testing stages
3. Build & artifact creation
4. Deployment stages
5. Smoke tests post-deploy
6. Rollback strategy

## 8.3 Monitoring & Observability
### Metrics
- Application: Response time, error rate, throughput
- Infrastructure: CPU, memory, disk I/O
- Business: Conversion funnel, user engagement

### Tools
- APM: [Datadog/New Relic]
- Logging: [Datadog/Splunk]
- Alerting: [PagerDuty/Opsgenie]

---

# 9. Risk Analysis & Mitigation
## 9.1 Technical Risks
| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| [Risk 1] | High/Med/Low | High/Med/Low | [Strategy] |

## 9.2 Business Risks
[Struktur serupa]

## 9.3 Mitigation Strategies
[Detail lengkap]

---

# 10. Budget & Resource
## 10.1 Development Cost
| Item | Estimation | Notes |
|------|------------|-------|
| Development hours | [X hours] | [Breakdown] |
| Infrastructure (monthly) | $[X] | [Detail] |
| Third-party services | $[X]/mo | [List] |

## 10.2 Team Structure
- Product Manager: [Hours/role]
- UI/UX Designer: [Hours/role]
- Frontend Developers: [Count]
- Backend Developers: [Count]
- DevOps Engineer: [Hours/role]
- QA Engineer: [Hours/role]

---

# 11. Appendix
## 11.1 Glossary
[Define technical & business terms]

## 11.2 References
- Industry best practices
- Competitor analysis
- Market research data

## 11.3 Open Questions
[Questions yang perlu diklarifikasi]

## 11.4 Change Log
| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 0.1 | [Date] | AI | Initial draft |

---

## ✅ MANDATORY COMPLETION CHECKLIST
Before finishing, verify you have covered:
- [x] ALL 11 sections are present and detailed
- [x] Each feature has User Story + Requirements + Acceptance Criteria
- [x] Technical specifications include specific technologies with versions
- [x] Success metrics are quantifiable (not vague)
- [x] Timeline includes specific weeks/dates
- [x] Budget section has realistic estimations
- [x] Risk analysis covers both technical and business

## 🚨 CRITICAL RULES
1. GENERATE THE ENTIRE DOCUMENT - DO NOT STOP EARLY
2. Each section must have SUBSTANTIAL content (not just headers)
3. Use specific numbers, metrics, and examples
4. Assume enterprise-grade quality standards
5. End with the signature: *Dokumen ini digenerate oleh AI PRD Generator berdasarkan input pengguna. Versi: 2.0 - Enterprise Grade.*

Write in Bahasa Indonesia by default unless the user writes in English.`;

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

    // Stream the response with comprehensive settings
    const result = streamText({
      model: providerConfig.chatModel(model),
      system: PRD_SYSTEM_PROMPT,
      prompt: fullPrompt,
      maxOutputTokens: 8000, // Generate up to ~6000 words (comprehensive PRD)
      temperature: 0.7, // Balanced creativity and coherence
      abortSignal: AbortSignal.timeout(120000), // 2 minutes for AI generation
      onFinish({ text, finishReason, usage }) {
        // Log completion details for monitoring
        console.log("PRD Generation Complete:", {
          finishReason,
          usage,
          textLength: text.length,
          timestamp: new Date().toISOString(),
        });
        
        // Warn if output was truncated
        if (finishReason === "length" || text.length > 7900 * 0.8) {
          console.warn("WARNING: PRD may have been truncated. Consider increasing maxOutputTokens or using a model with larger context window.");
        }
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
      const providerHint = provider === "gemini"
        ? "API key Gemini gratis memiliki batas penggunaan harian. Jika habis, Anda bisa membuat API key baru di Google AI Studio atau menunggu reset otomatis keesokan harinya."
        : "Model gratis OpenRouter memiliki limit harian. Jika habis, Anda bisa membuat API key baru di OpenRouter atau upgrade untuk limit lebih tinggi.";

      return NextResponse.json(
        {
          error: `Kuota API ${provider === "gemini" ? "Gemini" : "OpenRouter"} telah habis. ${providerHint}`,
          code: "RATE_LIMIT"
        },
        { status: 429 }
      );
    }

    // Check for insufficient credit (OpenRouter paid models)
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

"use client";

import { useState, useCallback } from "react";

interface UseStreamingOptions {
  apiEndpoint?: string;
  onComplete?: (content: string) => void;
  onError?: (error: string) => void;
}

interface UseStreamingReturn {
  content: string;
  isStreaming: boolean;
  error: string | null;
  startGeneration: (payload: { prompt: string; deployment: string }) => Promise<void>;
  reset: () => void;
}

export function useStreaming(options?: UseStreamingOptions): UseStreamingReturn {
  const [content, setContent] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startGeneration = useCallback(
    async (payload: { prompt: string; deployment: string }) => {
      setIsStreaming(true);
      setContent("");
      setError(null);

      try {
        // For actual implementation, this would connect to your API
        // const response = await fetch(options?.apiEndpoint || "/api/generate", {
        //   method: "POST",
        //   headers: { "Content-Type": "application/json" },
        //   body: JSON.stringify(payload),
        // });

        // if (!response.ok) throw new Error("Gagal memulai generasi");
        // if (!response.body) throw new Error("Stream tidak tersedia");

        // const reader = response.body.getReader();
        // const decoder = new TextDecoder();

        // while (true) {
        //   const { done, value } = await reader.read();
        //   if (done) break;
        //   const chunk = decoder.decode(value);
        //   setContent((prev) => prev + chunk);
        // }

        // Mock implementation for demo
        await simulateStreaming(payload, setContent);

        options?.onComplete?.(content);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Terjadi kesalahan";
        setError(errorMessage);
        options?.onError?.(errorMessage);
      } finally {
        setIsStreaming(false);
      }
    },
    [options]
  );

  const reset = useCallback(() => {
    setContent("");
    setIsStreaming(false);
    setError(null);
  }, []);

  return {
    content,
    isStreaming,
    error,
    startGeneration,
    reset,
  };
}

// Mock function to simulate streaming for demo purposes
async function simulateStreaming(
  payload: { prompt: string; deployment: string },
  onChunk: (chunk: string | ((prev: string) => string)) => void
) {
  const mockContent = generateMockPRD(payload.prompt, payload.deployment);
  const chars = mockContent.split("");

  for (let i = 0; i < chars.length; i++) {
    await new Promise((resolve) => setTimeout(resolve, 5));
    const char = chars[i];
    onChunk((prev) => prev + char);
  }
}

function generateMockPRD(prompt: string, deployment: string): string {
  const deploymentLabels: Record<string, string> = {
    vercel: "Vercel",
    netlify: "Netlify",
    vps: "VPS (Ubuntu Server)",
    cpanel: "cPanel Hosting",
  };

  return `# 1. Tujuan Produk

## 1.1 Ringkasan
${prompt}

## 1.2 Masalah yang Diselesaikan
Produk ini dirancang untuk mengatasi kebutuhan spesifik yang telah diidentifikasi melalui analisis pasar dan feedback pengguna.

## 1.3 Target Pengguna
- **Primary**: Pengguna utama yang akan menggunakan produk secara reguler
- **Secondary**: Stakeholder yang mendapatkan manfaat dari output produk

## 1.4 Keberhasilan Produk
Produk dianggap berhasil jika mencapai metrics berikut:
- User adoption rate > 70%
- User satisfaction score > 4.5/5
- Reduction in manual process time by 50%

---

# 2. Fitur Utama

## 2.1 MVP (Minimum Viable Product)
Fitur-fitur esensial yang harus ada pada rilis pertama:

### Core Feature 1
- **Deskripsi**: Fitur utama yang menjadi value proposition produk
- **Acceptance Criteria**: 
  - Kriteria 1
  - Kriteria 2
  - Kriteria 3

### Core Feature 2
- **Deskripsi**: Fitur pendukung untuk meningkatkan user experience
- **Acceptance Criteria**:
  - Kriteria 1
  - Kriteria 2

## 2.2 Nice to Have
Fitur tambahan untuk iterasi selanjutnya:
- Enhancement 1
- Enhancement 2
- Enhancement 3

---

# 3. Spesifikasi Teknis

## 3.1 Tech Stack
- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS
- **Backend**: Node.js, REST API
- **Database**: PostgreSQL
- **Authentication**: Better Auth
- **AI Integration**: OpenAI GPT-4

## 3.2 Arsitektur Sistem
\`\`\`
[Client] → [API Gateway] → [Application Server] → [Database]
               ↓
          [AI Service]
\`\`\`

## 3.3 Security Requirements
- JWT-based authentication
- Input validation & sanitization
- Rate limiting
- HTTPS/TLS encryption

---

# 4. Deployment

## 4.1 Target Platform
**${deploymentLabels[deployment] || "Vercel"}**

## 4.2 Environment Setup
- **Development**: Local environment dengan hot reload
- **Staging**: Pre-production environment untuk testing
- **Production**: Live environment dengan monitoring

## 4.3 CI/CD Pipeline
1. Code commit & push
2. Automated testing
3. Build & deploy
4. Smoke tests
5. Production release

---

# 5. Timeline

## 5.1 Fase Pengembangan
| Fase | Durasi | Deliverable |
|------|--------|-------------|
| Planning | 1 minggu | Dokumentasi lengkap |
| Development | 4 minggu | MVP |
| Testing | 1 minggu | Bug fixes |
| Launch | 1 minggu | Go-live |

## 5.2 Milestone
- **Week 2**: Prototype ready
- **Week 4**: Alpha release
- **Week 5**: Beta testing
- **Week 6**: Public launch

---

# 6. Appendix

## 6.1 Referensi
- Dokumentasi teknis
- API specifications
- Design mockups

## 6.2 Pertanyaan Terbuka
- Skalabilitas untuk high traffic
- Integrasi dengan third-party services
- Internationalization requirements

---

*Dokumen ini digenerate oleh AI PRD Generator berdasarkan input pengguna.*
`;
}

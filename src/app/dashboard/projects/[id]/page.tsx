"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  Copy,
  Download,
  Trash2,
  Clock,
  FileText,
  Cloud,
  Globe,
  Server,
  LayoutTemplate,
  FileDown,
  Share2,
} from "lucide-react";
import { toast } from "sonner";
import { generatePDF } from "@/app/actions/pdf";

// Mock data - in real app, this would come from database
const projectData = {
  id: 1,
  title: "E-Commerce Platform",
  prompt:
    "Sistem e-commerce dengan pembayaran QRIS dan manajemen inventori real-time",
  deployment: "vercel",
  content: `# 1. Tujuan Produk

## 1.1 Ringkasan
Sistem e-commerce dengan pembayaran QRIS dan manajemen inventori real-time

## 1.2 Masalah yang Diselesaikan
Produk ini dirancang untuk mengatasi kebutuhan bisnis retail yang memerlukan sistem pembayaran digital yang efisien dan manajemen stok yang akurat.

## 1.3 Target Pengguna
- **Primary**: Pemilik toko retail dan UMKM
- **Secondary**: Staff operasional dan admin gudang

## 1.4 Keberhasilan Produk
- User adoption rate > 70%
- Transaksi per hari > 1000
- Error rate < 0.1%

---

# 2. Fitur Utama

## 2.1 MVP

### QRIS Payment Integration
- **Deskripsi**: Integrasi pembayaran QRIS untuk multiple bank dan e-wallet
- **Acceptance Criteria**:
  - Support QRIS dari BCA, Mandiri, BRI, BNI
  - E-wallet support (GoPay, OVO, Dana, LinkAja)
  - Real-time payment confirmation
  - Auto-generate QR code per transaction

### Inventory Management
- **Deskripsi**: Sistem manajemen stok real-time
- **Acceptance Criteria**:
  - Stok berkurang otomatis saat transaksi
  - Alert stok menipis
  - Riwayat perubahan stok
  - Multi-warehouse support

### Dashboard Analytics
- **Deskripsi**: Dashboard untuk monitoring penjualan dan stok
- **Acceptance Criteria**:
  - Grafik penjualan harian/mingguan/bulanan
  - Top selling products
  - Revenue tracking
  - Low stock alerts

---

# 3. Spesifikasi Teknis

## 3.1 Tech Stack
- **Frontend**: Next.js 15, React 19, Tailwind CSS, shadcn/ui
- **Backend**: Node.js, Express/Fastify
- **Database**: PostgreSQL + Redis (caching)
- **Payment Gateway**: Midtrans/Xendit
- **QRIS**: Integration via payment gateway

## 3.2 Arsitektur Sistem
\`\`\`
[Customer] → [Frontend] → [API Gateway] → [App Server] → [Database]
                   ↓
            [Payment Gateway] → [QRIS Network]
\`\`\`

## 3.3 Security Requirements
- PCI DSS compliance untuk payment data
- JWT authentication dengan refresh token
- Rate limiting pada API endpoints
- Input validation dan sanitization
- HTTPS/TLS encryption end-to-end

---

# 4. Deployment

## 4.1 Target Platform
**Vercel**

## 4.2 Environment Variables
\`\`\`env
DATABASE_URL=postgresql://...
REDIS_URL=redis://...
MIDTRANS_SERVER_KEY=...
MIDTRANS_CLIENT_KEY=...
JWT_SECRET=...
\`\`\`

## 4.3 CI/CD Pipeline
1. Git push ke main branch
2. Run automated tests (unit & integration)
3. Build Next.js application
4. Deploy ke Vercel (staging)
5. Run smoke tests
6. Promote ke production

---

# 5. Timeline

## 5.1 Fase Pengembangan
| Fase | Durasi | Deliverable |
|------|--------|-------------|
| Design | 1 minggu | UI mockups, Tech spec |
| Development | 4 minggu | MVP features |
| Testing | 2 minggu | QA, UAT, Bug fixes |
| Launch | 1 minggu | Soft launch, Full launch |

---

*Dokumen ini digenerate oleh AI PRD Generator.*
`,
  createdAt: new Date("2024-01-15"),
  updatedAt: new Date("2024-01-15"),
};

const deploymentIcons: Record<string, React.ReactNode> = {
  vercel: <Cloud className="h-4 w-4" />,
  netlify: <Globe className="h-4 w-4" />,
  vps: <Server className="h-4 w-4" />,
  cpanel: <LayoutTemplate className="h-4 w-4" />,
};

const deploymentLabels: Record<string, string> = {
  vercel: "Vercel",
  netlify: "Netlify",
  vps: "VPS",
  cpanel: "cPanel",
};

const deploymentColors: Record<string, string> = {
  vercel: "bg-black text-white",
  netlify: "bg-[#00C7B7] text-white",
  vps: "bg-[#475569] text-white",
  cpanel: "bg-[#FF6C2C] text-white",
};

export default function ProjectDetailPage() {
  const params = useParams();
  const projectId = params.id as string;

  // In real app, fetch project by ID
  const project = projectData;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(project.content);
      toast.success("PRD berhasil disalin!");
  } catch {
    toast.error("Gagal menyalin");
    }
  };

  const handleDownload = () => {
    const blob = new Blob([project.content], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${project.title.toLowerCase().replace(/\s+/g, "-")}-prd.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("PRD berhasil diunduh!");
  };

  const handleDelete = () => {
    // TODO: Implement delete
    toast.success("PRD berhasil dihapus!");
  };

  const handleShare = async () => {
    try {
      const publicUrl = `${window.location.origin}/p/${projectId}`;
      await navigator.clipboard.writeText(publicUrl);
      toast.success("Link publik berhasil disalin!");
    } catch {
      toast.error("Gagal menyalin link");
    }
  };

  const handleDownloadPDF = async () => {
    try {
      toast.loading("Menghasilkan PDF...", { id: "pdf-generating" });
      const pdfBuffer = await generatePDF(projectId);

      // Create blob from buffer (convert Buffer to Uint8Array for browser compatibility)
      const uint8Array = new Uint8Array(pdfBuffer);
      const blob = new Blob([uint8Array], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);

      // Create download link
      const a = document.createElement("a");
      a.href = url;
      a.download = `${project.title.toLowerCase().replace(/\s+/g, "-")}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast.success("PDF berhasil diunduh!", { id: "pdf-generating" });
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error(
        error instanceof Error ? error.message : "Gagal menghasilkan PDF",
        { id: "pdf-generating" }
      );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <Button
            variant="ghost"
            className="mb-4 -ml-4 text-[#64748B] hover:text-[#0F172A]"
            asChild
          >
            <Link href="/dashboard">
              <ArrowLeft className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Kembali ke Dashboard</span>
              <span className="sm:hidden">Kembali</span>
            </Link>
          </Button>
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2">
            <h2 className="text-xl sm:text-2xl font-bold text-[#0F172A] truncate">
              {project.title}
            </h2>
            <Badge
              className={`${deploymentColors[project.deployment]} font-medium whitespace-nowrap`}
            >
              <span className="mr-1">{deploymentIcons[project.deployment]}</span>
              {deploymentLabels[project.deployment]}
            </Badge>
          </div>
          <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-sm text-[#64748B]">
            <span className="flex items-center gap-1">
              <FileText className="h-4 w-4" />
              PRD #{projectId}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              Dibuat {format(project.createdAt, "d MMMM yyyy", { locale: id })}
            </span>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          <Button
            variant="outline"
            className="border-[#E2E8F0] text-[#334155] flex-1 sm:flex-none"
            onClick={handleCopy}
          >
            <Copy className="h-4 w-4 sm:mr-2" />
            <span className="hidden sm:inline">Copy</span>
          </Button>
          <Button
            variant="outline"
            className="border-[#E2E8F0] text-[#334155] flex-1 sm:flex-none"
            onClick={handleShare}
          >
            <Share2 className="h-4 w-4 sm:mr-2" />
            <span className="hidden sm:inline">Share</span>
          </Button>
          <Button
            variant="outline"
            className="border-[#E2E8F0] text-[#334155] flex-1 sm:flex-none"
            onClick={handleDownload}
          >
            <Download className="h-4 w-4 sm:mr-2" />
            <span className="hidden sm:inline">MD</span>
          </Button>
          <Button
            variant="outline"
            className="border-[#E2E8F0] text-[#334155] flex-1 sm:flex-none"
            onClick={handleDownloadPDF}
          >
            <FileDown className="h-4 w-4 sm:mr-2" />
            <span className="hidden sm:inline">PDF</span>
          </Button>
          <Button
            variant="outline"
            className="border-[#E2E8F0] text-[#F43F5E] hover:bg-[#FFF1F2] flex-1 sm:flex-none"
            onClick={handleDelete}
          >
            <Trash2 className="h-4 w-4 sm:mr-2" />
            <span className="hidden sm:inline">Hapus</span>
          </Button>
        </div>
      </div>

      <Separator className="bg-[#E2E8F0]" />

      {/* Original Prompt */}
      <Card className="border-[#E2E8F0] bg-[#F8FAFC]">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-[#64748B]">
            Prompt Asli
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-[#475569]">{project.prompt}</p>
        </CardContent>
      </Card>

      {/* PRD Content */}
      <Card className="border-[#E2E8F0]">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-[#0F172A]">
            Dokumen PRD
          </CardTitle>
          <CardDescription>
            Dokumen spesifikasi lengkap untuk proyek ini
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="prose prose-slate max-w-none">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {project.content}
            </ReactMarkdown>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

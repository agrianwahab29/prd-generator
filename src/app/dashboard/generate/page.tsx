"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
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
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Sparkles,
  Copy,
  Download,
  Save,
  AlertCircle,
  Check,
  Loader2,
  Cloud,
  Globe,
  Server,
  LayoutTemplate,
} from "lucide-react";
import { toast } from "sonner";
import { saveProject } from "@/app/actions/projects";

const generateSchema = z.object({
  prompt: z.string().min(10, "Deskripsi minimal 10 karakter"),
  deployment: z.string().min(1, "Pilih target deployment"),
});

type GenerateForm = z.infer<typeof generateSchema>;

const deploymentOptions = [
  {
    value: "vercel",
    label: "Vercel",
    icon: Cloud,
    color: "bg-black",
    description: "Serverless, auto-deploy dari Git",
    badge: "Popular",
    badgeColor: "bg-[#F97316] text-white",
  },
  {
    value: "netlify",
    label: "Netlify",
    icon: Globe,
    color: "bg-[#00C7B7]",
    description: "Static sites & serverless functions",
    badge: "",
    badgeColor: "",
  },
  {
    value: "vps",
    label: "VPS (Ubuntu)",
    icon: Server,
    color: "bg-[#475569]",
    description: "Full control, Docker support",
    badge: "Advanced",
    badgeColor: "bg-[#6366F1] text-white",
  },
  {
    value: "cpanel",
    label: "cPanel",
    icon: LayoutTemplate,
    color: "bg-[#FF6C2C]",
    description: "Shared hosting, PHP/MySQL",
    badge: "",
    badgeColor: "",
  },
];

const promptTemplates = [
  {
    title: "E-Commerce Platform",
    description: "Toko online lengkap dengan pembayaran",
    prompt: "Sistem e-commerce dengan fitur: katalog produk, keranjang belanja, checkout dengan berbagai metode pembayaran (transfer bank, e-wallet, QRIS), manajemen inventori real-time, notifikasi WhatsApp untuk order, dan dashboard admin untuk laporan penjualan harian/bulanan.",
    deployment: "vercel",
  },
  {
    title: "Learning Management System",
    description: "Platform belajar online dengan video",
    prompt: "Platform pembelajaran online untuk kursus programming dengan fitur: upload video materi, quiz interaktif dengan penilaian otomatis, progress tracking untuk siswa, forum diskusi per materi, sertifikat digital setelah menyelesaikan kursus, dan pembayaran untuk kursus premium.",
    deployment: "vercel",
  },
  {
    title: "POS & Inventory System",
    description: "Kasir dan manajemen stok terintegrasi",
    prompt: "Sistem Point of Sale (POS) untuk retail dengan fitur: scan barcode produk, multiple metode pembayaran, cetak struk thermal, manajemen stok multi-cabang, laporan penjualan real-time, prediksi stok habis, dan integrasi dengan akuntansi dasar.",
    deployment: "vps",
  },
  {
    title: "SaaS Booking System",
    description: "Reservasi online untuk layanan jasa",
    prompt: "Sistem booking online untuk jasa service/konsultasi dengan fitur: kalender availability real-time, pemilihan slot waktu, pembayaran DP atau full, reminder email/SMS otomatis sebelum jadwal, reschedule/cancel booking, dan review rating setelah service selesai.",
    deployment: "vercel",
  },
  {
    title: "Blog & Newsletter",
    description: "CMS blog dengan subscription",
    prompt: "Platform blogging modern dengan fitur: rich text editor (Notion-like), auto-save draft, SEO optimization otomatis (meta tags, sitemap), newsletter subscription dengan Mailchimp/SendGrid integration, komentar dengan moderasi, dan analytics dasar (page views, popular posts).",
    deployment: "netlify",
  },
];

export default function GeneratePage() {
  const [content, setContent] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<GenerateForm>({
    resolver: zodResolver(generateSchema),
  });

  const deployment = watch("deployment");

  const onSubmit = async (data: GenerateForm) => {
    setIsStreaming(true);
    setIsComplete(false);
    setError(null);
    setContent("");

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: data.prompt,
          deployment: data.deployment,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Gagal menghasilkan PRD");
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) throw new Error("No response body");

      let currentContent = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        currentContent += decoder.decode(value, { stream: true });
        setContent(currentContent);
      }

      setIsComplete(true);
      toast.success("PRD berhasil dihasilkan!");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal menghasilkan PRD. Silakan coba lagi.");
      toast.error("Gagal menghasilkan PRD");
    } finally {
      setIsStreaming(false);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      toast.success("PRD berhasil disalin!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Gagal menyalin");
    }
  };

  const handleDownload = () => {
    const blob = new Blob([content], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `prd-${Date.now()}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("PRD berhasil diunduh!");
  };

  const handleSave = async () => {
    try {
      // Extract title from first heading or use a default
      const titleMatch = content.match(/^#\s+(.+)/m);
      const title = titleMatch ? titleMatch[1].substring(0, 100) : `PRD - ${new Date().toLocaleDateString()}`;
      
      await saveProject({
        title,
        prompt: watch("prompt") || "",
        deploymentTarget: watch("deployment") || "vercel",
        generatedPrd: content,
      });
      toast.success("PRD berhasil disimpan ke dashboard!");
    } catch {
      toast.error("Gagal menyimpan PRD. Pastikan Anda sudah login.");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-[#0F172A]">Generate PRD</h2>
        <p className="text-[#475569]">
          Deskripsikan ide proyek Anda dan biarkan AI menghasilkan dokumen spesifikasi
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[45%_55%]">
        {/* Mobile-first: stacks vertically, lg: side-by-side */}
        {/* Input Form */}
        <Card className="border-[#E2E8F0]">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-[#0F172A]">
              Deskripsikan Proyek Anda
            </CardTitle>
            <CardDescription>
              Berikan deskripsi detail tentang aplikasi yang ingin Anda buat
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Template Selector */}
              <div className="space-y-2">
                <Label className="text-[#334155]">Template Prompt (Opsional)</Label>
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-[#E2E8F0] scrollbar-track-transparent">
                  {promptTemplates.map((template, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => {
                        setValue("prompt", template.prompt);
                        setValue("deployment", template.deployment);
                      }}
                      disabled={isStreaming}
                      className="flex-shrink-0 text-left p-3 rounded-lg border border-[#E2E8F0] bg-white hover:bg-[#F8FAFC] hover:border-[#4F46E5] transition-all duration-200 group disabled:opacity-50 disabled:cursor-not-allowed w-[200px]"
                    >
                      <p className="font-semibold text-[#0F172A] text-sm group-hover:text-[#4F46E5]">
                        {template.title}
                      </p>
                      <p className="text-xs text-[#64748B] mt-1 line-clamp-2">
                        {template.description}
                      </p>
                    </button>
                  ))}
                </div>
                <p className="text-xs text-[#64748B]">
                  Klik template untuk mengisi prompt dan target deployment secara otomatis
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="prompt" className="text-[#334155]">
                  Ide / Konsep Aplikasi
                </Label>
                <Textarea
                  id="prompt"
                  placeholder="Contoh: Sistem kasir online untuk restoran dengan fitur QRIS, manajemen meja, dan laporan penjualan real-time..."
                  className="min-h-[180px] border-[#E2E8F0] focus:border-[#4F46E5] focus:ring-[#4F46E5] resize-y"
                  disabled={isStreaming}
                  {...register("prompt")}
                />
                {errors.prompt && (
                  <p className="text-sm text-[#F43F5E]">
                    {errors.prompt.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label className="text-[#334155]">Target Deployment</Label>
                <Select
                  value={deployment}
                  onValueChange={(value) => setValue("deployment", value)}
                  disabled={isStreaming}
                >
                  <SelectTrigger className="border-[#E2E8F0] focus:border-[#4F46E5] focus:ring-[#4F46E5] h-auto py-3">
                    <SelectValue placeholder="Pilih environment" />
                  </SelectTrigger>
                  <SelectContent className="min-w-[280px]">
                    {deploymentOptions.map((option) => {
                      const IconComponent = option.icon;
                      return (
                        <SelectItem
                          key={option.value}
                          value={option.value}
                          className="py-3 px-3"
                        >
                          <div className="flex items-start gap-3 w-full">
                            <div className={`flex-shrink-0 h-10 w-10 rounded-lg ${option.color} flex items-center justify-center`}>
                              <IconComponent className="h-5 w-5 text-white" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="font-medium text-[#0F172A] text-sm">
                                  {option.label}
                                </span>
                                {option.badge && (
                                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium ${option.badgeColor}`}>
                                    {option.badge}
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-[#64748B] mt-0.5">
                                {option.description}
                              </p>
                            </div>
                          </div>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
                {errors.deployment && (
                  <p className="text-sm text-[#F43F5E]">
                    {errors.deployment.message}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full h-11 bg-[#F97316] hover:bg-[#EA580C] text-white gap-2"
                disabled={isStreaming}
              >
                {isStreaming ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Menghasilkan...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    Generate PRD
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Output Display */}
        <Card className="border-[#E2E8F0] flex flex-col">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <div>
              <CardTitle className="text-lg font-semibold text-[#0F172A]">
                Hasil PRD
              </CardTitle>
              <CardDescription>
                {isStreaming
                  ? "AI sedang menghasilkan dokumen..."
                  : isComplete
                  ? "Dokumen spesifikasi lengkap"
                  : "Hasil akan muncul di sini"}
              </CardDescription>
            </div>
            {isStreaming && (
              <div className="flex items-center gap-2 text-sm text-[#F97316]">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#F97316] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-[#F97316]"></span>
                </span>
                Generating
              </div>
            )}
          </CardHeader>
          <CardContent className="flex-1 flex flex-col">
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="flex-1 min-h-[400px] max-h-[600px] overflow-y-auto rounded-lg border border-[#E2E8F0] bg-white p-6">
              {isStreaming && !content && (
                <div className="space-y-3">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                  <Skeleton className="h-4 w-4/5" />
                  <div className="pt-4">
                    <Skeleton className="h-8 w-1/2" />
                  </div>
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              )}

              {content && (
                <div className="prose prose-slate max-w-none">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {content}
                  </ReactMarkdown>
                  {isStreaming && (
                    <span className="streaming-cursor inline-block w-2 h-5 bg-[#4F46E5] ml-1 align-middle"></span>
                  )}
                </div>
              )}

              {!isStreaming && !content && !error && (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#EEF2FF] mb-4">
                    <Sparkles className="h-8 w-8 text-[#4F46E5]" />
                  </div>
                  <p className="text-[#475569]">
                    Masukkan deskripsi proyek dan klik &quot;Generate PRD&quot;
                  </p>
                </div>
              )}
            </div>

            {isComplete && content && (
              <div className="flex gap-2 mt-4 pt-4 border-t border-[#E2E8F0]">
                <Button
                  variant="outline"
                  className="flex-1 border-[#E2E8F0] text-[#334155]"
                  onClick={handleCopy}
                >
                  {copied ? (
                    <>
                      <Check className="h-4 w-4 mr-2 text-[#10B981]" />
                      Tersalin
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4 mr-2" />
                      Copy
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 border-[#E2E8F0] text-[#334155]"
                  onClick={handleDownload}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
                <Button
                  className="flex-1 bg-[#4F46E5] hover:bg-[#4338CA] text-white"
                  onClick={handleSave}
                >
                  <Save className="h-4 w-4 mr-2" />
                  Simpan
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

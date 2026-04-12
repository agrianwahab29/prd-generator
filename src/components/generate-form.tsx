"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Sparkles,
  Copy,
  Download,
  Save,
  AlertCircle,
  Check,
  Globe,
  HardDrive,
  PanelsTopLeft,
  ArrowUpToLine,
  Wand2,
  FileText,
  Zap,
  Lightbulb,
  Rocket,
  Code2,
  ShoppingCart,
  GraduationCap,
  Store,
  Calendar,
  Newspaper,
  ChevronRight,
  CheckCircle2,
  Play,
  LayoutTemplate,
} from "lucide-react";
import { toast } from "sonner";
import { saveProject } from "@/app/actions/projects";

const generateSchema = z.object({
  prompt: z.string().min(10, "Deskripsi minimal 10 karakter"),
  deployment: z.string().min(1, "Pilih target deployment"),
});

type GenerateForm = z.infer<typeof generateSchema>;

type DeploymentOption = {
  value: string;
  label: string;
  icon: React.ElementType;
  description: string;
  features: string[];
  color: string;
  bgGradient: string;
  borderColor: string;
};

const deploymentOptions: DeploymentOption[] = [
  {
    value: "vercel",
    label: "Vercel",
    icon: ArrowUpToLine,
    description: "Deploy cepat dengan edge network global",
    features: ["Serverless", "Edge", "Git Integration"],
    color: "text-slate-900",
    bgGradient: "from-slate-100 to-slate-50",
    borderColor: "border-slate-200",
  },
  {
    value: "netlify",
    label: "Netlify",
    icon: Globe,
    description: "Platform JAMstack dengan fitur lengkap",
    features: ["Forms", "Identity", "Edge Functions"],
    color: "text-teal-600",
    bgGradient: "from-teal-50 to-teal-100/50",
    borderColor: "border-teal-200",
  },
  {
    value: "vps",
    label: "VPS Ubuntu",
    icon: HardDrive,
    description: "Full control dengan root access",
    features: ["Docker", "SSH", "Custom Stack"],
    color: "text-orange-600",
    bgGradient: "from-orange-50 to-orange-100/50",
    borderColor: "border-orange-200",
  },
  {
    value: "cpanel",
    label: "cPanel Hosting",
    icon: PanelsTopLeft,
    description: "Shared hosting dengan softaculous",
    features: ["PHP", "MySQL", "Email"],
    color: "text-red-600",
    bgGradient: "from-red-50 to-red-100/50",
    borderColor: "border-red-200",
  },
];

type Template = {
  title: string;
  description: string;
  icon: React.ElementType;
  prompt: string;
  deployment: string;
  color: string;
  lightColor: string;
  borderColor: string;
  textColor: string;
};

const promptTemplates: Template[] = [
  {
    title: "E-Commerce",
    description: "Toko online lengkap",
    icon: ShoppingCart,
    prompt: "Sistem e-commerce dengan fitur: katalog produk, keranjang belanja, checkout dengan berbagai metode pembayaran (transfer bank, e-wallet, QRIS), manajemen inventori real-time, notifikasi WhatsApp untuk order, dan dashboard admin untuk laporan penjualan harian/bulanan.",
    deployment: "vercel",
    color: "bg-blue-500",
    lightColor: "bg-blue-50",
    borderColor: "border-blue-200",
    textColor: "text-blue-600",
  },
  {
    title: "LMS Platform",
    description: "Belajar online dengan video",
    icon: GraduationCap,
    prompt: "Platform pembelajaran online untuk kursus programming dengan fitur: upload video materi, quiz interaktif dengan penilaian otomatis, progress tracking untuk siswa, forum diskusi per materi, sertifikat digital setelah menyelesaikan kursus, dan pembayaran untuk kursus premium.",
    deployment: "vercel",
    color: "bg-emerald-500",
    lightColor: "bg-emerald-50",
    borderColor: "border-emerald-200",
    textColor: "text-emerald-600",
  },
  {
    title: "POS System",
    description: "Kasir & manajemen stok",
    icon: Store,
    prompt: "Sistem Point of Sale (POS) untuk retail dengan fitur: scan barcode produk, multiple metode pembayaran, cetak struk thermal, manajemen stok multi-cabang, laporan penjualan real-time, prediksi stok habis, dan integrasi dengan akuntansi dasar.",
    deployment: "vps",
    color: "bg-orange-500",
    lightColor: "bg-orange-50",
    borderColor: "border-orange-200",
    textColor: "text-orange-600",
  },
  {
    title: "Booking SaaS",
    description: "Reservasi untuk jasa",
    icon: Calendar,
    prompt: "Sistem booking online untuk jasa service/konsultasi dengan fitur: kalender availability real-time, pemilihan slot waktu, pembayaran DP atau full, reminder email/SMS otomatis sebelum jadwal, reschedule/cancel booking, dan review rating setelah service selesai.",
    deployment: "vercel",
    color: "bg-purple-500",
    lightColor: "bg-purple-50",
    borderColor: "border-purple-200",
    textColor: "text-purple-600",
  },
  {
    title: "Blog Platform",
    description: "CMS dengan newsletter",
    icon: Newspaper,
    prompt: "Platform blogging modern dengan fitur: rich text editor (Notion-like), auto-save draft, SEO optimization otomatis (meta tags, sitemap), newsletter subscription dengan Mailchimp/SendGrid integration, komentar dengan moderasi, dan analytics dasar (page views, popular posts).",
    deployment: "netlify",
    color: "bg-rose-500",
    lightColor: "bg-rose-50",
    borderColor: "border-rose-200",
    textColor: "text-rose-600",
  },
];

export function GenerateForm() {
  const [content, setContent] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [selectedDeployment, setSelectedDeployment] = useState<string>("");

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

  useEffect(() => {
    if (deployment) {
      setSelectedDeployment(deployment);
    }
  }, [deployment]);

  const onSubmit = async (data: GenerateForm) => {
    setIsStreaming(true);
    setIsComplete(false);
    setError(null);
    setContent("");

    const controller = new AbortController();
    // 80 second timeout to stay under Vercel's 60s hobby limit (with buffer)
    // If using Vercel Pro with 300s limit, you can increase this to 290s
    const timeoutId = setTimeout(() => controller.abort(), 80000);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: data.prompt,
          deployment: data.deployment,
        }),
        signal: controller.signal,
      });

      if (!response.ok) {
        let errorMessage = "Gagal menghasilkan PRD";
        const contentType = response.headers.get("content-type");
        
        try {
          // Check if response is JSON
          if (contentType && contentType.includes("application/json")) {
            const errorData = await response.json();
            errorMessage = errorData.error || errorMessage;
          } else {
            // Response is not JSON (e.g., 504 Gateway Timeout from Vercel edge)
            const textError = await response.text().catch(() => "");
            console.error("Non-JSON error response:", { status: response.status, text: textError.substring(0, 200) });
            
            if (response.status === 504 || textError.toLowerCase().includes("timeout")) {
              errorMessage = "Server timeout — AI terlalu lama merespons. Ini biasanya terjadi saat server sibuk. Silakan coba lagi dalam 1-2 menit.";
            } else if (response.status === 502 || response.status === 503) {
              errorMessage = "Server sedang sibuk atau dalam maintenance. Silakan coba lagi dalam beberapa saat.";
            } else if (response.status === 524) {
              errorMessage = "Connection timeout — Server tidak merespons tepat waktu. Silakan coba dengan deskripsi yang lebih singkat.";
            } else if (textError) {
              // Try to extract meaningful error from HTML/text response
              const cleanError = textError.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
              errorMessage = `Server error (${response.status}): ${cleanError.substring(0, 150)}`;
            } else {
              errorMessage = `Server error (${response.status}). Silakan coba lagi.`;
            }
          }
        } catch (parseError) {
          console.error("Failed to parse error response:", parseError);
          errorMessage = `Server error (${response.status}). Gagal membaca respons dari server.`;
        }
        throw new Error(errorMessage);
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
      toast.success("PRD berhasil dihasilkan!", {
        icon: <CheckCircle2 className="h-4 w-4 text-emerald-500" />,
      });
    } catch (err) {
      let errorMessage = "Gagal menghasilkan PRD. Silakan coba lagi.";
      if (err instanceof Error && err.name === "AbortError") {
        errorMessage = "Permintaan timeout. Server terlalu lama merespons, silakan coba lagi.";
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }
      setError(errorMessage);
      toast.error("Gagal menghasilkan PRD");
    } finally {
      clearTimeout(timeoutId);
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

  const applyTemplate = (template: Template) => {
    setValue("prompt", template.prompt);
    setValue("deployment", template.deployment);
    setSelectedDeployment(template.deployment);
    toast.success(`Template "${template.title}" diterapkan!`, {
      icon: <template.icon className={`h-4 w-4 ${template.textColor}`} />,
    });
  };

  return (
    <div className="space-y-6">
      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-[1fr_1.3fr]">
        {/* Left Column - Input Form */}
        <div className="space-y-5 animate-slide-up-subtle">
          {/* Template Cards */}
          <Card className="border-slate-200 shadow-sm bg-white/80 backdrop-blur-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <LayoutTemplate className="h-4 w-4 text-indigo-500" />
                <CardTitle className="text-sm font-semibold text-slate-700">
                  Mulai dengan Template
                </CardTitle>
              </div>
              <CardDescription className="text-xs">
                Pilih template untuk memulai dengan cepat
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {promptTemplates.map((template, index) => {
                  const Icon = template.icon;
                  return (
                    <button
                      key={index}
                      type="button"
                      onClick={() => applyTemplate(template)}
                      disabled={isStreaming}
                      className={`group relative p-4 rounded-xl border text-left transition-all duration-200
                        disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden
                        ${template.lightColor} ${template.borderColor} border hover:shadow-md tap-scale`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`flex-shrink-0 w-10 h-10 rounded-lg ${template.color} 
                          flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow`}
                        >
                          <Icon className="h-5 w-5 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`font-semibold text-sm ${template.textColor} group-hover:brightness-110`}>
                            {template.title}
                          </p>
                          <p className="text-xs text-slate-500 mt-0.5">
                            {template.description}
                          </p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Prompt Input */}
          <Card className="border-slate-200 shadow-sm bg-white/80 backdrop-blur-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-slate-600" />
                  <CardTitle className="text-sm font-semibold text-slate-700">
                    Deskripsi Proyek
                  </CardTitle>
                </div>
                <span className="text-xs text-slate-400">
                  Minimal 10 karakter
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div className="space-y-2">
                  <div className="relative">
                    <Textarea
                      id="prompt"
                      placeholder="Contoh: Sistem kasir online untuk restoran dengan fitur QRIS, manajemen meja, dan laporan penjualan real-time..."
                      className="min-h-[140px] bg-slate-50 border-slate-200 text-slate-800 placeholder:text-slate-400
                        focus:border-indigo-500 focus:ring-indigo-500/20 resize-none rounded-xl
                        transition-all duration-200"
                      disabled={isStreaming}
                      {...register("prompt")}
                    />
                  </div>
                  {errors.prompt && (
                    <p className="text-sm text-rose-500 flex items-center gap-1.5">
                      <AlertCircle className="h-3.5 w-3.5" />
                      {errors.prompt.message}
                    </p>
                  )}
                </div>

                {/* Deployment Selection */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Rocket className="h-4 w-4 text-slate-600" />
                    <span className="text-sm font-semibold text-slate-700">Target Deployment</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {deploymentOptions.map((option) => {
                      const Icon = option.icon;
                      const isSelected = selectedDeployment === option.value;
                      return (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => {
                            setValue("deployment", option.value);
                            setSelectedDeployment(option.value);
                          }}
                          disabled={isStreaming}
                          className={`relative p-4 rounded-xl border text-left transition-all duration-200
                            disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden tap-scale
                            ${isSelected
                              ? `border-indigo-500 bg-gradient-to-br from-indigo-50 to-violet-50/50 shadow-md ring-1 ring-indigo-500/20`
                              : `bg-gradient-to-br ${option.bgGradient} ${option.borderColor} border hover:shadow-sm`
                            }`}
                        >
                          <div className="flex items-start gap-3">
                            <div className={`flex-shrink-0 w-9 h-9 rounded-lg 
                              ${isSelected ? "bg-indigo-500" : "bg-white/80"}
                              flex items-center justify-center shadow-sm`}
                            >
                              <Icon className={`h-4 w-4 ${isSelected ? "text-white" : option.color}`} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-1.5">
                                <span className={`font-semibold text-sm ${isSelected ? "text-indigo-900" : "text-slate-700"}`}>
                                  {option.label}
                                </span>
                                {isSelected && (
                                  <span className="w-4 h-4 rounded-full bg-indigo-500 flex items-center justify-center animate-scale-in">
                                    <Check className="h-2.5 w-2.5 text-white" />
                                  </span>
                                )}
                              </div>
                              <p className={`text-xs mt-0.5 ${isSelected ? "text-indigo-600" : "text-slate-500"}`}>
                                {option.description}
                              </p>
                            </div>
                          </div>
                          
                          {/* Features badges */}
                          <div className="flex flex-wrap gap-1 mt-2">
                            {option.features.map((feature, i) => (
                              <span 
                                key={i} 
                                className={`text-[10px] px-1.5 py-0.5 rounded ${
                                  isSelected 
                                    ? "bg-indigo-100 text-indigo-700" 
                                    : "bg-white/60 text-slate-500"
                                }`}
                              >
                                {feature}
                              </span>
                            ))}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                  {errors.deployment && (
                    <p className="text-sm text-rose-500 flex items-center gap-1.5">
                      <AlertCircle className="h-3.5 w-3.5" />
                      {errors.deployment.message}
                    </p>
                  )}
                </div>

                {/* Generate Button */}
                <Button
                  type="submit"
                  disabled={isStreaming}
                  className="w-full h-12 bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-600 
                    hover:from-indigo-500 hover:via-violet-500 hover:to-indigo-500
                    text-white font-semibold text-sm rounded-xl
                    shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40
                    transition-all duration-300 border-0 btn-hover-lift"
                >
                  {isStreaming ? (
                    <div className="flex items-center gap-3">
                      <div className="flex gap-1">
                        <span className="w-2 h-2 bg-white/90 rounded-full bounce-dot bounce-dot-1" />
                        <span className="w-2 h-2 bg-white/90 rounded-full bounce-dot bounce-dot-2" />
                        <span className="w-2 h-2 bg-white/90 rounded-full bounce-dot bounce-dot-3" />
                      </div>
                      <span className="text-white/90">AI Sedang Membuat PRD...</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-5 w-5" />
                      <span>Generate PRD</span>
                      <ChevronRight className="h-4 w-4 opacity-70" />
                    </div>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Output Display */}
        <div className="relative animate-slide-up-subtle stagger-2">
          <div className="sticky top-4">
            <Card className="border-slate-200 shadow-sm bg-white/80 backdrop-blur-sm overflow-hidden">
              {/* Output Header */}
              <CardHeader className="flex flex-row items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-slate-100">
                    <Code2 className="h-4 w-4 text-slate-600" />
                  </div>
                  <div>
                    <CardTitle className="text-sm font-semibold text-slate-800">
                      Hasil PRD
                    </CardTitle>
                    <CardDescription className="text-xs">
                      {isStreaming
                        ? "AI sedang menghasilkan..."
                        : isComplete
                        ? "Dokumen siap digunakan"
                        : "Belum ada output"}
                    </CardDescription>
                  </div>
                </div>
                
                {/* Status Badge */}
                {isStreaming && (
                  <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-700 text-xs font-medium flex items-center gap-1.5">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                    </span>
                    Generating
                  </span>
                )}
                {isComplete && (
                  <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-medium flex items-center gap-1.5 animate-scale-in">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Selesai
                  </span>
                )}
                
                {/* Action Buttons */}
                {isComplete && content && (
                  <div className="flex items-center gap-1.5">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleCopy}
                      className="h-8 px-2.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100"
                    >
                      {copied ? (
                        <Check className="h-4 w-4 text-emerald-500" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleDownload}
                      className="h-8 px-2.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100"
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      onClick={handleSave}
                      className="h-8 px-4 bg-indigo-600 hover:bg-indigo-700 text-white"
                    >
                      <Save className="h-4 w-4 mr-1.5" />
                      Simpan
                    </Button>
                  </div>
                )}
              </CardHeader>

              {/* Output Content */}
              <CardContent className="p-0">
                {/* Error Alert */}
                {error && (
                  <div className="m-4 animate-fade-in">
                    <Alert className="bg-rose-50 border-rose-200 text-rose-800">
                      <AlertCircle className="h-4 w-4 text-rose-500" />
                      <AlertDescription className="text-sm">{error}</AlertDescription>
                    </Alert>
                  </div>
                )}

                {/* Content Display */}
                <div className="h-[calc(100vh-320px)] min-h-[450px] max-h-[650px] overflow-y-auto bg-slate-50/50">
                  {/* Skeleton Loading */}
                  {isStreaming && !content && (
                    <div className="p-6 space-y-4">
                      <div className="flex items-center gap-3 mb-6">
                        <Skeleton className="w-8 h-8 rounded-lg" />
                        <Skeleton className="h-5 w-40 rounded" />
                      </div>
                      {[...Array(8)].map((_, i) => (
                        <Skeleton 
                          key={i} 
                          className={`h-4 rounded ${i % 3 === 0 ? "w-full" : i % 3 === 1 ? "w-5/6" : "w-4/5"}`} 
                        />
                      ))}
                    </div>
                  )}

                  {/* Generated Content - ReactMarkdown kept for streaming (client-only) */}
                  {content && (
                    <div className="p-6">
                      <div className="prose prose-slate max-w-none">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
                        {isStreaming && (
                          <span className="inline-block w-2 h-5 bg-indigo-500 ml-1 align-middle rounded-sm streaming-cursor-bar" />
                        )}
                      </div>
                    </div>
                  )}

                  {/* Empty State */}
                  {!isStreaming && !content && !error && (
                    <div className="flex flex-col items-center justify-center h-full text-center px-8 py-16 animate-fade-in">
                      <div className="relative mb-5">
                        <div className="absolute inset-0 bg-indigo-200/50 blur-2xl rounded-full scale-150" />
                        <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-100 to-violet-100 border border-indigo-200 shadow-lg">
                          <Sparkles className="h-8 w-8 text-indigo-500" />
                        </div>
                      </div>
                      <h3 className="text-lg font-semibold text-slate-800 mb-1">
                        Siap Membuat PRD?
                      </h3>
                      <p className="text-slate-500 max-w-sm text-sm leading-relaxed">
                        Masukkan deskripsi proyek Anda, pilih target deployment, dan biarkan AI bekerja.
                      </p>
                      <div className="flex items-center gap-5 mt-5 text-xs text-slate-400">
                        <span className="flex items-center gap-1.5">
                          <Zap className="h-3.5 w-3.5 text-amber-500" />
                          Cepat
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Check className="h-3.5 w-3.5 text-emerald-500" />
                          Profesional
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Code2 className="h-3.5 w-3.5 text-indigo-500" />
                          Lengkap
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

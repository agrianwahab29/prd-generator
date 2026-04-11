"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { motion, AnimatePresence } from "framer-motion";
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
  Loader2,
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
  Cloud,
  Cpu,
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

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
};

export default function GeneratePage() {
  const [content, setContent] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [selectedDeployment, setSelectedDeployment] = useState<string>("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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
      toast.success("PRD berhasil dihasilkan!", {
        icon: <CheckCircle2 className="h-4 w-4 text-emerald-500" />,
      });
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

  if (!mounted) return null;

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="space-y-6"
    >
      {/* Header Section */}
      <motion.div variants={itemVariants} className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 shadow-md">
              <Wand2 className="h-4 w-4 text-white" />
            </div>
            <span className="text-sm font-medium text-indigo-600 uppercase tracking-wide">
              AI Generator
            </span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900">
            Generate PRD
          </h2>
          <p className="text-slate-500 mt-1 max-w-xl">
            Deskripsikan ide proyek Anda dan biarkan AI menghasilkan dokumen spesifikasi yang lengkap dan profesional.
          </p>
        </div>
      </motion.div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-[1fr_1.3fr]">
        {/* Left Column - Input Form */}
        <motion.div variants={cardVariants} className="space-y-5">
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
                    <motion.button
                      key={index}
                      type="button"
                      onClick={() => applyTemplate(template)}
                      disabled={isStreaming}
                      whileHover={{ scale: 1.02, y: -1 }}
                      whileTap={{ scale: 0.98 }}
                      className={`group relative p-4 rounded-xl border text-left transition-all duration-200
                        disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden
                        ${template.lightColor} ${template.borderColor} border hover:shadow-md`}
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
                    </motion.button>
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
                    <div className="absolute bottom-3 right-3 flex gap-0.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-slate-300 animate-pulse" />
                      <div className="w-1.5 h-1.5 rounded-full bg-slate-300 animate-pulse delay-75" />
                      <div className="w-1.5 h-1.5 rounded-full bg-slate-300 animate-pulse delay-150" />
                    </div>
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
                        <motion.button
                          key={option.value}
                          type="button"
                          onClick={() => {
                            setValue("deployment", option.value);
                            setSelectedDeployment(option.value);
                          }}
                          disabled={isStreaming}
                          whileHover={{ scale: 1.02, y: -1 }}
                          whileTap={{ scale: 0.98 }}
                          className={`relative p-4 rounded-xl border text-left transition-all duration-200
                            disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden
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
                                  <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="w-4 h-4 rounded-full bg-indigo-500 flex items-center justify-center"
                                  >
                                    <Check className="h-2.5 w-2.5 text-white" />
                                  </motion.div>
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
                        </motion.button>
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
                <motion.div
                  whileHover={{ scale: isStreaming ? 1 : 1.01 }}
                  whileTap={{ scale: isStreaming ? 1 : 0.99 }}
                >
                  <Button
                    type="submit"
                    disabled={isStreaming}
                    className="w-full h-12 bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-600 
                      hover:from-indigo-500 hover:via-violet-500 hover:to-indigo-500
                      text-white font-semibold text-sm rounded-xl
                      shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40
                      transition-all duration-300 border-0"
                  >
                    {isStreaming ? (
                      <div className="flex items-center gap-3">
                        <div className="flex gap-1">
                          <motion.span 
                            className="w-2 h-2 bg-white/90 rounded-full"
                            animate={{ y: [0, -4, 0] }}
                            transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                          />
                          <motion.span 
                            className="w-2 h-2 bg-white/90 rounded-full"
                            animate={{ y: [0, -4, 0] }}
                            transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                          />
                          <motion.span 
                            className="w-2 h-2 bg-white/90 rounded-full"
                            animate={{ y: [0, -4, 0] }}
                            transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                          />
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
                </motion.div>
              </form>
            </CardContent>
          </Card>
        </motion.div>

        {/* Right Column - Output Display */}
        <motion.div variants={cardVariants} className="relative">
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
                <AnimatePresence mode="wait">
                  {isStreaming && (
                    <motion.span
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-700 text-xs font-medium flex items-center gap-1.5"
                    >
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                      </span>
                      Generating
                    </motion.span>
                  )}
                  {isComplete && (
                    <motion.span
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-medium flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      Selesai
                    </motion.span>
                  )}
                </AnimatePresence>
                
                {/* Action Buttons */}
                {isComplete && content && (
                  <div className="flex items-center gap-1.5">
                    <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}>
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
                    </motion.div>
                    <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.05 }}>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleDownload}
                        className="h-8 px-2.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100"
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    </motion.div>
                    <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }}>
                      <Button
                        size="sm"
                        onClick={handleSave}
                        className="h-8 px-4 bg-indigo-600 hover:bg-indigo-700 text-white"
                      >
                        <Save className="h-4 w-4 mr-1.5" />
                        Simpan
                      </Button>
                    </motion.div>
                  </div>
                )}
              </CardHeader>

              {/* Output Content */}
              <CardContent className="p-0">
                {/* Error Alert */}
                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="m-4"
                    >
                      <Alert className="bg-rose-50 border-rose-200 text-rose-800">
                        <AlertCircle className="h-4 w-4 text-rose-500" />
                        <AlertDescription className="text-sm">{error}</AlertDescription>
                      </Alert>
                    </motion.div>
                  )}
                </AnimatePresence>

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

                  {/* Generated Content */}
                  {content && (
                    <div className="p-6">
                      <div className="prose prose-slate max-w-none">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
                        {isStreaming && (
                          <motion.span
                            initial={{ opacity: 0 }}
                            animate={{ opacity: [0, 1, 0] }}
                            transition={{ duration: 0.8, repeat: Infinity }}
                            className="inline-block w-2 h-5 bg-indigo-500 ml-1 align-middle rounded-sm"
                          />
                        )}
                      </div>
                    </div>
                  )}

                  {/* Empty State */}
                  {!isStreaming && !content && !error && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 }}
                      className="flex flex-col items-center justify-center h-full text-center px-8 py-16"
                    >
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
                    </motion.div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </div>

      {/* Custom Styles for Prose */}
      <style jsx global>{`
        .prose {
          --tw-prose-body: #475569;
          --tw-prose-headings: #0f172a;
          --tw-prose-lead: #64748b;
          --tw-prose-links: #4f46e5;
          --tw-prose-bold: #0f172a;
          --tw-prose-counters: #4f46e5;
          --tw-prose-bullets: #94a3b8;
          --tw-prose-hr: #e2e8f0;
          --tw-prose-quotes: #0f172a;
          --tw-prose-quote-borders: #4f46e5;
          --tw-prose-captions: #64748b;
          --tw-prose-code: #4f46e5;
          --tw-prose-pre-code: #334155;
          --tw-prose-pre-bg: #f8fafc;
          --tw-prose-th-borders: #e2e8f0;
          --tw-prose-td-borders: #f1f5f9;
        }
        
        .prose h1 {
          font-size: 1.5rem;
          font-weight: 700;
          margin-bottom: 1rem;
          color: #0f172a;
          border-bottom: 2px solid #e2e8f0;
          padding-bottom: 0.5rem;
        }
        
        .prose h2 {
          font-size: 1.25rem;
          font-weight: 600;
          margin-top: 1.5rem;
          margin-bottom: 0.75rem;
          color: #1e293b;
        }
        
        .prose h3 {
          font-size: 1.125rem;
          font-weight: 600;
          margin-top: 1.25rem;
          margin-bottom: 0.5rem;
          color: #334155;
        }
        
        .prose ul > li {
          margin: 0.375rem 0;
        }
        
        .prose ul > li::marker {
          color: #4f46e5;
        }
        
        .prose code {
          background: #e0e7ff;
          color: #4f46e5;
          padding: 0.2rem 0.4rem;
          border-radius: 0.375rem;
          font-size: 0.875rem;
          font-weight: 500;
        }
        
        .prose pre {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 0.75rem;
          padding: 1rem;
        }
        
        .prose pre code {
          background: transparent;
          color: #334155;
          padding: 0;
        }
        
        .prose blockquote {
          border-left: 3px solid #4f46e5;
          background: #f8fafc;
          padding: 0.75rem 1rem;
          border-radius: 0 0.5rem 0.5rem 0;
          font-style: italic;
          color: #475569;
        }
        
        .prose table {
          width: 100%;
          border-collapse: collapse;
          margin: 1rem 0;
          font-size: 0.875rem;
        }
        
        .prose th {
          background: #f1f5f9;
          padding: 0.625rem 0.875rem;
          text-align: left;
          font-weight: 600;
          color: #0f172a;
          border-bottom: 2px solid #e2e8f0;
        }
        
        .prose td {
          padding: 0.625rem 0.875rem;
          border-bottom: 1px solid #f1f5f9;
        }
        
        .prose tr:hover td {
          background: #f8fafc;
        }
        
        .prose hr {
          border-color: #e2e8f0;
          margin: 1.5rem 0;
        }
        
        .prose strong {
          color: #0f172a;
          font-weight: 600;
        }
        
        .prose a {
          color: #4f46e5;
          text-decoration: none;
          font-weight: 500;
          border-bottom: 1px solid #c7d2fe;
          transition: border-color 0.2s;
        }
        
        .prose a:hover {
          border-bottom-color: #4f46e5;
        }
      `}</style>
    </motion.div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
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
  X,
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
  gradient: string;
};

const deploymentOptions: DeploymentOption[] = [
  {
    value: "vercel",
    label: "Vercel",
    icon: ArrowUpToLine,
    description: "Platform terbaik untuk frontend modern",
    features: ["Serverless Functions", "Edge Network", "Auto-deploy"],
    color: "#0F172A",
    gradient: "from-slate-900 to-slate-800",
  },
  {
    value: "netlify",
    label: "Netlify",
    icon: Globe,
    description: "Static sites & JAMstack",
    features: ["Form Handling", "Identity", "Edge Functions"],
    color: "#00C7B7",
    gradient: "from-teal-600 to-teal-700",
  },
  {
    value: "vps",
    label: "VPS Ubuntu",
    icon: HardDrive,
    description: "Full control dengan Docker",
    features: ["Root Access", "Docker Ready", "Scalable"],
    color: "#E95420",
    gradient: "from-orange-600 to-orange-700",
  },
  {
    value: "cpanel",
    label: "cPanel",
    icon: PanelsTopLeft,
    description: "Shared hosting klasik",
    features: ["Softaculous", "Email Hosting", "FTP Access"],
    color: "#FF6C2C",
    gradient: "from-red-600 to-red-700",
  },
];

const promptTemplates = [
  {
    title: "E-Commerce",
    description: "Toko online lengkap",
    icon: ShoppingCart,
    prompt: "Sistem e-commerce dengan fitur: katalog produk, keranjang belanja, checkout dengan berbagai metode pembayaran (transfer bank, e-wallet, QRIS), manajemen inventori real-time, notifikasi WhatsApp untuk order, dan dashboard admin untuk laporan penjualan harian/bulanan.",
    deployment: "vercel",
    gradient: "from-blue-500/20 to-cyan-500/20",
    iconColor: "text-blue-400",
  },
  {
    title: "LMS Platform",
    description: "Belajar online dengan video",
    icon: GraduationCap,
    prompt: "Platform pembelajaran online untuk kursus programming dengan fitur: upload video materi, quiz interaktif dengan penilaian otomatis, progress tracking untuk siswa, forum diskusi per materi, sertifikat digital setelah menyelesaikan kursus, dan pembayaran untuk kursus premium.",
    deployment: "vercel",
    gradient: "from-emerald-500/20 to-green-500/20",
    iconColor: "text-emerald-400",
  },
  {
    title: "POS System",
    description: "Kasir & manajemen stok",
    icon: Store,
    prompt: "Sistem Point of Sale (POS) untuk retail dengan fitur: scan barcode produk, multiple metode pembayaran, cetak struk thermal, manajemen stok multi-cabang, laporan penjualan real-time, prediksi stok habis, dan integrasi dengan akuntansi dasar.",
    deployment: "vps",
    gradient: "from-orange-500/20 to-amber-500/20",
    iconColor: "text-orange-400",
  },
  {
    title: "Booking SaaS",
    description: "Reservasi untuk jasa",
    icon: Calendar,
    prompt: "Sistem booking online untuk jasa service/konsultasi dengan fitur: kalender availability real-time, pemilihan slot waktu, pembayaran DP atau full, reminder email/SMS otomatis sebelum jadwal, reschedule/cancel booking, dan review rating setelah service selesai.",
    deployment: "vercel",
    gradient: "from-purple-500/20 to-pink-500/20",
    iconColor: "text-purple-400",
  },
  {
    title: "Blog Platform",
    description: "CMS dengan newsletter",
    icon: Newspaper,
    prompt: "Platform blogging modern dengan fitur: rich text editor (Notion-like), auto-save draft, SEO optimization otomatis (meta tags, sitemap), newsletter subscription dengan Mailchimp/SendGrid integration, komentar dengan moderasi, dan analytics dasar (page views, popular posts).",
    deployment: "netlify",
    gradient: "from-rose-500/20 to-pink-500/20",
    iconColor: "text-rose-400",
  },
];

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.6,
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
        icon: <Sparkles className="h-4 w-4 text-amber-400" />,
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

  const applyTemplate = (template: typeof promptTemplates[0]) => {
    setValue("prompt", template.prompt);
    setValue("deployment", template.deployment);
    setSelectedDeployment(template.deployment);
    toast.success(`Template "${template.title}" diterapkan!`);
  };

  if (!mounted) return null;

  return (
    <div className="min-h-[calc(100vh-4rem)]">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-500/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-[120px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-slate-800/20 rounded-full blur-[150px]" />
      </div>

      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="relative z-10 max-w-[1600px] mx-auto"
      >
        {/* Header Section */}
        <motion.div variants={itemVariants} className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 shadow-lg shadow-orange-500/20">
              <Wand2 className="h-5 w-5 text-white" />
            </div>
            <span className="text-sm font-medium text-slate-400 uppercase tracking-wider">
              AI Product Designer
            </span>
          </div>
          <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2">
            Buat Dokumen Spesifikasi
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl">
            Deskripsikan ide proyek Anda, pilih target deployment, dan biarkan AI menghasilkan PRD profesional yang lengkap.
          </p>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-[1fr_1.2fr] gap-6">
          {/* Left Column - Input Form */}
          <motion.div variants={cardVariants} className="space-y-6">
            {/* Template Cards */}
            <div className="bg-slate-900/50 backdrop-blur-xl rounded-2xl border border-slate-800/60 p-5">
              <div className="flex items-center gap-2 mb-4">
                <Lightbulb className="h-4 w-4 text-amber-400" />
                <span className="text-sm font-medium text-slate-300">Mulai dengan Template</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 gap-3">
                {promptTemplates.map((template, index) => {
                  const Icon = template.icon;
                  return (
                    <motion.button
                      key={index}
                      type="button"
                      onClick={() => applyTemplate(template)}
                      disabled={isStreaming}
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      className={`group relative p-4 rounded-xl border border-slate-700/50 bg-slate-800/40 
                        hover:bg-slate-800/60 hover:border-slate-600/50 transition-all duration-300
                        text-left disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden`}
                    >
                      <div className={`absolute inset-0 bg-gradient-to-br ${template.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                      <div className="relative z-10">
                        <Icon className={`h-5 w-5 ${template.iconColor} mb-2`} />
                        <p className="font-semibold text-slate-200 text-sm group-hover:text-white transition-colors">
                          {template.title}
                        </p>
                        <p className="text-xs text-slate-500 mt-1 group-hover:text-slate-400 transition-colors">
                          {template.description}
                        </p>
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* Prompt Input */}
            <div className="bg-slate-900/50 backdrop-blur-xl rounded-2xl border border-slate-800/60 p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-blue-400" />
                  <span className="text-sm font-medium text-slate-300">Deskripsi Proyek</span>
                </div>
                <span className="text-xs text-slate-500">
                  Minimal 10 karakter
                </span>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div className="relative">
                  <Textarea
                    id="prompt"
                    placeholder="Contoh: Sistem kasir online untuk restoran dengan fitur QRIS, manajemen meja, dan laporan penjualan real-time..."
                    className="min-h-[160px] bg-slate-950/50 border-slate-700/50 text-slate-200 placeholder:text-slate-600
                      focus:border-amber-500/50 focus:ring-amber-500/20 resize-none rounded-xl
                      transition-all duration-300"
                    disabled={isStreaming}
                    {...register("prompt")}
                  />
                  <div className="absolute bottom-3 right-3 flex gap-1">
                    <div className="w-2 h-2 rounded-full bg-slate-700 animate-pulse" />
                    <div className="w-2 h-2 rounded-full bg-slate-700 animate-pulse delay-75" />
                    <div className="w-2 h-2 rounded-full bg-slate-700 animate-pulse delay-150" />
                  </div>
                </div>
                {errors.prompt && (
                  <p className="text-sm text-red-400 flex items-center gap-1.5">
                    <AlertCircle className="h-3.5 w-3.5" />
                    {errors.prompt.message}
                  </p>
                )}

                {/* Deployment Selection */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Rocket className="h-4 w-4 text-emerald-400" />
                    <span className="text-sm font-medium text-slate-300">Target Deployment</span>
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
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className={`relative p-4 rounded-xl border text-left transition-all duration-300
                            disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden
                            ${isSelected
                              ? "border-amber-500/50 bg-gradient-to-br from-amber-500/10 to-orange-500/10 shadow-lg shadow-amber-500/10"
                              : "border-slate-700/50 bg-slate-800/30 hover:bg-slate-800/50 hover:border-slate-600/50"
                            }`}
                        >
                          <div className="flex items-start gap-3">
                            <div className={`flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br ${option.gradient} 
                              flex items-center justify-center shadow-lg`}
                            >
                              <Icon className="h-5 w-5 text-white" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <span className={`font-semibold text-sm ${isSelected ? "text-amber-400" : "text-slate-300"}`}>
                                  {option.label}
                                </span>
                                {isSelected && (
                                  <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="w-4 h-4 rounded-full bg-amber-500 flex items-center justify-center"
                                  >
                                    <Check className="h-2.5 w-2.5 text-slate-950" />
                                  </motion.div>
                                )}
                              </div>
                              <p className="text-xs text-slate-500 mt-0.5">
                                {option.description}
                              </p>
                            </div>
                          </div>
                        </motion.button>
                      );
                    })}
                  </div>
                  {errors.deployment && (
                    <p className="text-sm text-red-400 flex items-center gap-1.5">
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
                    className="w-full h-14 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 
                      hover:from-amber-400 hover:via-orange-400 hover:to-amber-500
                      text-white font-semibold text-base rounded-xl
                      shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40
                      transition-all duration-300 border-0"
                  >
                    {isStreaming ? (
                      <div className="flex items-center gap-3">
                        <div className="flex gap-1">
                          <span className="w-2 h-2 bg-white/80 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                          <span className="w-2 h-2 bg-white/80 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                          <span className="w-2 h-2 bg-white/80 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
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
            </div>
          </motion.div>

          {/* Right Column - Output Display */}
          <motion.div variants={cardVariants} className="relative">
            <div className="sticky top-4">
              <div className="bg-slate-900/50 backdrop-blur-xl rounded-2xl border border-slate-800/60 overflow-hidden">
                {/* Output Header */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800/60">
                  <div className="flex items-center gap-3">
                    <Code2 className="h-5 w-5 text-blue-400" />
                    <span className="font-semibold text-slate-200">Hasil PRD</span>
                    {isStreaming && (
                      <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 text-xs font-medium animate-pulse">
                        Generating
                      </span>
                    )}
                    {isComplete && (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-medium">
                        Selesai
                      </span>
                    )}
                  </div>
                  
                  {/* Action Buttons */}
                  {isComplete && content && (
                    <div className="flex items-center gap-2">
                      <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={handleCopy}
                          className="h-8 px-3 text-slate-400 hover:text-white hover:bg-slate-800/50"
                        >
                          {copied ? (
                            <Check className="h-4 w-4 text-emerald-400" />
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
                          className="h-8 px-3 text-slate-400 hover:text-white hover:bg-slate-800/50"
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      </motion.div>
                      <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }}>
                        <Button
                          size="sm"
                          onClick={handleSave}
                          className="h-8 px-4 bg-slate-800 hover:bg-slate-700 text-white border border-slate-700"
                        >
                          <Save className="h-4 w-4 mr-1.5" />
                          Simpan
                        </Button>
                      </motion.div>
                    </div>
                  )}
                </div>

                {/* Output Content */}
                <div className="relative">
                  {/* Error Alert */}
                  <AnimatePresence>
                    {error && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute top-4 left-4 right-4 z-20"
                      >
                        <Alert className="bg-red-950/80 border-red-800/50 text-red-200 backdrop-blur-xl">
                          <AlertCircle className="h-4 w-4 text-red-400" />
                          <AlertDescription className="text-sm">{error}</AlertDescription>
                        </Alert>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Content Display */}
                  <div className="h-[calc(100vh-280px)] min-h-[500px] overflow-y-auto bg-slate-950/30">
                    {/* Skeleton Loading */}
                    {isStreaming && !content && (
                      <div className="p-6 space-y-4">
                        <div className="flex items-center gap-3 mb-6">
                          <div className="w-8 h-8 rounded-lg bg-slate-800 animate-pulse" />
                          <div className="h-6 w-48 bg-slate-800 rounded animate-pulse" />
                        </div>
                        {[...Array(6)].map((_, i) => (
                          <div key={i} className="space-y-2">
                            <div className={`h-4 bg-slate-800 rounded animate-pulse ${i % 3 === 0 ? "w-full" : i % 3 === 1 ? "w-5/6" : "w-4/5"}`} />
                          </div>
                        ))}
                        <div className="h-8 w-32 bg-slate-800 rounded animate-pulse mt-6" />
                        {[...Array(4)].map((_, i) => (
                          <div key={`b-${i}`} className={`h-4 bg-slate-800 rounded animate-pulse ${i % 2 === 0 ? "w-full" : "w-3/4"}`} />
                        ))}
                      </div>
                    )}

                    {/* Generated Content */}
                    {content && (
                      <div className="p-6">
                        <div className="prose prose-invert prose-slate max-w-none">
                          <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
                          {isStreaming && (
                            <motion.span
                              initial={{ opacity: 0 }}
                              animate={{ opacity: [0, 1, 0] }}
                              transition={{ duration: 0.8, repeat: Infinity }}
                              className="inline-block w-2 h-5 bg-amber-500 ml-1 align-middle rounded-sm"
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
                        className="flex flex-col items-center justify-center h-full text-center px-8"
                      >
                        <div className="relative mb-6">
                          <div className="absolute inset-0 bg-amber-500/20 blur-2xl rounded-full" />
                          <div className="relative flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700/50 shadow-2xl">
                            <Sparkles className="h-10 w-10 text-amber-400" />
                          </div>
                        </div>
                        <h3 className="text-xl font-semibold text-white mb-2">
                          Siap Membuat PRD?
                        </h3>
                        <p className="text-slate-400 max-w-md text-center leading-relaxed">
                          Masukkan deskripsi proyek Anda di sebelah kiri, pilih target deployment, 
                          dan biarkan AI menghasilkan dokumen spesifikasi yang lengkap dan profesional.
                        </p>
                        <div className="flex items-center gap-4 mt-6 text-xs text-slate-500">
                          <span className="flex items-center gap-1.5">
                            <Zap className="h-3.5 w-3.5 text-amber-400" />
                            Cepat
                          </span>
                          <span className="flex items-center gap-1.5">
                            <Check className="h-3.5 w-3.5 text-emerald-400" />
                            Profesional
                          </span>
                          <span className="flex items-center gap-1.5">
                            <Code2 className="h-3.5 w-3.5 text-blue-400" />
                            Teknis
                          </span>
                        </div>
                      </motion.div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Custom Styles for Prose */}
      <style jsx global>{`
        .prose-invert {
          --tw-prose-body: #cbd5e1;
          --tw-prose-headings: #f8fafc;
          --tw-prose-lead: #94a3b8;
          --tw-prose-links: #fbbf24;
          --tw-prose-bold: #f8fafc;
          --tw-prose-counters: #fbbf24;
          --tw-prose-bullets: #64748b;
          --tw-prose-hr: #334155;
          --tw-prose-quotes: #f8fafc;
          --tw-prose-quote-borders: #fbbf24;
          --tw-prose-captions: #64748b;
          --tw-prose-code: #fbbf24;
          --tw-prose-pre-code: #cbd5e1;
          --tw-prose-pre-bg: #0f172a;
          --tw-prose-th-borders: #334155;
          --tw-prose-td-borders: #1e293b;
        }
        
        .prose h1 {
          font-size: 1.875rem;
          font-weight: 700;
          margin-bottom: 1.5rem;
          background: linear-gradient(135deg, #f8fafc 0%, #fbbf24 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        
        .prose h2 {
          font-size: 1.5rem;
          font-weight: 600;
          margin-top: 2rem;
          margin-bottom: 1rem;
          color: #f8fafc;
          border-bottom: 1px solid #334155;
          padding-bottom: 0.5rem;
        }
        
        .prose h3 {
          font-size: 1.25rem;
          font-weight: 600;
          margin-top: 1.5rem;
          margin-bottom: 0.75rem;
          color: #e2e8f0;
        }
        
        .prose ul > li {
          margin: 0.5rem 0;
        }
        
        .prose ul > li::marker {
          color: #fbbf24;
        }
        
        .prose code {
          background: #1e293b;
          padding: 0.25rem 0.5rem;
          border-radius: 0.375rem;
          font-size: 0.875rem;
        }
        
        .prose pre {
          background: #0f172a;
          border: 1px solid #334155;
          border-radius: 0.75rem;
          padding: 1rem;
        }
        
        .prose blockquote {
          border-left: 3px solid #fbbf24;
          background: #1e293b/50;
          padding: 1rem 1.5rem;
          border-radius: 0 0.5rem 0.5rem 0;
          font-style: italic;
        }
        
        .prose table {
          width: 100%;
          border-collapse: collapse;
          margin: 1.5rem 0;
        }
        
        .prose th {
          background: #1e293b;
          padding: 0.75rem 1rem;
          text-align: left;
          font-weight: 600;
          color: #f8fafc;
          border-bottom: 2px solid #334155;
        }
        
        .prose td {
          padding: 0.75rem 1rem;
          border-bottom: 1px solid #1e293b;
        }
        
        .prose tr:hover td {
          background: #1e293b/30;
        }
        
        .prose hr {
          border-color: #334155;
          margin: 2rem 0;
        }
        
        .prose strong {
          color: #fbbf24;
        }
        
        .prose a {
          color: #fbbf24;
          text-decoration: none;
          border-bottom: 1px dashed #fbbf24/50;
          transition: border-bottom 0.2s;
        }
        
        .prose a:hover {
          border-bottom: 1px solid #fbbf24;
        }
      `}</style>
    </div>
  );
}

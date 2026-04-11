"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Settings,
  Key,
  Globe,
  Bell,
  Shield,
  Eye,
  EyeOff,
  Save,
  Loader2,
  Check,
  User,
  Mail,
  Info,
  Bot,
  Zap,
  Sparkles,
  Brain,
  ChevronRight,
  Cpu,
  CheckCircle2,
  AlertTriangle,
  Lock,
  FileText,
} from "lucide-react";
import { toast } from "sonner";
import {
  updateApiKey,
  getUserSettings,
  getUserProfile,
  updateLanguagePreference,
  updateNotificationPreferences,
} from "@/app/actions/settings";

const apiKeySchema = z.object({
  apiKey: z.string().optional(),
  provider: z.string().min(1, "Pilih provider"),
  model: z.string().optional(),
});

type ApiKeyForm = z.infer<typeof apiKeySchema>;

interface UserProfile {
  name: string;
  email: string;
  image: string;
}

interface UserSettings {
  apiProvider: string;
  apiModel: string;
  hasCustomApiKey: boolean;
  language: string;
  notifyPrdGenerated: boolean;
  notifyEmailUpdates: boolean;
  notifyMarketing: boolean;
}

// Enhanced animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.05,
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

const cardHoverVariants = {
  rest: { scale: 1, y: 0 },
  hover: { 
    scale: 1.01, 
    y: -2,
    transition: { duration: 0.2, ease: "easeOut" }
  },
};

export default function SettingsPage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    async function loadData() {
      try {
        const [profileData, settingsData] = await Promise.all([
          getUserProfile(),
          getUserSettings(),
        ]);
        setProfile(profileData);
        setSettings(settingsData);
      } catch (error) {
        console.error("Failed to load settings:", error);
        toast.error("Gagal memuat pengaturan");
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  if (!mounted) return null;

  if (isLoading) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center">
        <motion.div
          className="flex gap-1.5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-2.5 h-2.5 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600"
              animate={{ y: [0, -10, 0] }}
              transition={{ 
                duration: 0.6, 
                repeat: Infinity, 
                delay: i * 0.15,
                ease: "easeInOut"
              }}
            />
          ))}
        </motion.div>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-4 text-sm text-slate-500 font-medium"
        >
          Memuat pengaturan...
        </motion.p>
      </div>
    );
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="space-y-8 max-w-5xl mx-auto"
    >
      {/* Header - Clean Editorial Style */}
      <motion.div variants={itemVariants} className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500/10 to-violet-500/10 border border-indigo-200/50">
            <Settings className="h-5 w-5 text-indigo-600" />
          </div>
          <div>
            <span className="text-xs font-semibold text-indigo-600/80 uppercase tracking-wider">
              Konfigurasi
            </span>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
              Pengaturan
            </h1>
          </div>
        </div>
        <p className="text-slate-500 text-base max-w-xl leading-relaxed">
          Kelola preferensi akun dan konfigurasi API untuk pengalaman terbaik dalam membuat PRD
        </p>
      </motion.div>

      {/* Tabs with enhanced styling */}
      <motion.div variants={itemVariants}>
        <Tabs defaultValue="api" className="w-full">
          <TabsList className="bg-white border border-slate-200/80 mb-8 p-1.5 rounded-xl shadow-sm shadow-slate-200/50 h-auto inline-flex">
            <TabsTrigger 
              value="api" 
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500/10 data-[state=active]:to-violet-500/10 data-[state=active]:text-indigo-700 data-[state=active]:border-indigo-200 data-[state=active]:shadow-sm px-5 py-2.5 text-sm font-medium text-slate-600 transition-all rounded-lg border border-transparent"
            >
              <Key className="h-4 w-4 mr-2" />
              API Key
            </TabsTrigger>
            <TabsTrigger 
              value="profile"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500/10 data-[state=active]:to-violet-500/10 data-[state=active]:text-indigo-700 data-[state=active]:border-indigo-200 data-[state=active]:shadow-sm px-5 py-2.5 text-sm font-medium text-slate-600 transition-all rounded-lg border border-transparent"
            >
              <User className="h-4 w-4 mr-2" />
              Profil
            </TabsTrigger>
            <TabsTrigger 
              value="language"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500/10 data-[state=active]:to-violet-500/10 data-[state=active]:text-indigo-700 data-[state=active]:border-indigo-200 data-[state=active]:shadow-sm px-5 py-2.5 text-sm font-medium text-slate-600 transition-all rounded-lg border border-transparent"
            >
              <Globe className="h-4 w-4 mr-2" />
              Bahasa
            </TabsTrigger>
            <TabsTrigger 
              value="notifications"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500/10 data-[state=active]:to-violet-500/10 data-[state=active]:text-indigo-700 data-[state=active]:border-indigo-200 data-[state=active]:shadow-sm px-5 py-2.5 text-sm font-medium text-slate-600 transition-all rounded-lg border border-transparent"
            >
              <Bell className="h-4 w-4 mr-2" />
              Notifikasi
            </TabsTrigger>
          </TabsList>

          <AnimatePresence mode="wait">
            <TabsContent value="api" className="space-y-6 mt-0">
              <ApiKeySettings initialSettings={settings} />
            </TabsContent>

            <TabsContent value="profile" className="space-y-6 mt-0">
              <ProfileSettings profile={profile} />
            </TabsContent>

            <TabsContent value="language" className="space-y-6 mt-0">
              <LanguageSettings initialLanguage={settings?.language || "id"} />
            </TabsContent>

            <TabsContent value="notifications" className="space-y-6 mt-0">
              <NotificationSettings
                initialPrdGenerated={settings?.notifyPrdGenerated ?? true}
                initialEmailUpdates={settings?.notifyEmailUpdates ?? true}
                initialMarketing={settings?.notifyMarketing ?? false}
              />
            </TabsContent>
          </AnimatePresence>
        </Tabs>
      </motion.div>
    </motion.div>
  );
}

function ApiKeySettings({ initialSettings }: { initialSettings: UserSettings | null }) {
  const [showApiKey, setShowApiKey] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [useCustomKey, setUseCustomKey] = useState(initialSettings?.hasCustomApiKey ?? false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ApiKeyForm>({
    resolver: zodResolver(apiKeySchema),
    defaultValues: {
      provider: initialSettings?.apiProvider || "gemini",
      model: initialSettings?.apiModel || "google/gemma-4-31b-it:free",
      apiKey: "",
    },
  });

  const provider = watch("provider");
  const model = watch("model");

  const showModelSelection = provider === "openrouter";

  useEffect(() => {
    if (provider === "gemini") {
      setValue("model", "auto");
    } else {
      setValue("model", "google/gemma-4-31b-it:free");
    }
  }, [provider, setValue]);

  const onSubmit = async (data: ApiKeyForm) => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      if (useCustomKey && data.apiKey) {
        formData.append("apiKey", data.apiKey);
      } else {
        formData.append("apiKey", "");
      }
      formData.append("provider", data.provider);
      const selectedModel = data.provider === "gemini" ? "auto" : (data.model || "google/gemma-4-31b-it:free");
      formData.append("model", selectedModel);

      await updateApiKey(formData);
      toast.success("Konfigurasi API berhasil disimpan!", {
        icon: <CheckCircle2 className="h-4 w-4 text-emerald-500" />,
      });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Gagal menyimpan konfigurasi API");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="border-slate-200/80 shadow-lg shadow-slate-200/50 bg-white/90 backdrop-blur-sm overflow-hidden">
        <CardHeader className="pb-6 border-b border-slate-100">
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500/10 to-violet-500/10 border border-indigo-200/50">
              <Cpu className="h-6 w-6 text-indigo-600" />
            </div>
            <div>
              <CardTitle className="text-xl font-semibold text-slate-900">
                Konfigurasi AI Provider
              </CardTitle>
              <CardDescription className="text-sm text-slate-500 mt-1">
                Pilih provider AI dan konfigurasi API key untuk generate PRD
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6 space-y-6">
          {/* Info Alert - Enhanced */}
          <Alert className="bg-gradient-to-r from-indigo-50/80 to-violet-50/80 border-indigo-200/50 text-indigo-900 rounded-xl">
            <Info className="h-4 w-4 text-indigo-600" />
            <AlertDescription className="text-sm text-indigo-800/80">
              {provider === "gemini"
                ? "Google Gemini menyediakan API key gratis dengan limit harian. Model dipilih otomatis berdasarkan ketersediaan kuota."
                : "OpenRouter menyediakan akses ke berbagai model AI dengan limit harian. Pilih model yang tersedia di bawah."}
            </AlertDescription>
          </Alert>

          {/* Warning Alert - Enhanced */}
          <Alert className="bg-gradient-to-r from-amber-50/80 to-orange-50/80 border-amber-200/50 text-amber-900 rounded-xl">
            <AlertTriangle className="h-4 w-4 text-amber-600" />
            <AlertDescription className="text-sm text-amber-800/80">
              <strong className="font-semibold">Perhatian:</strong>{" "}
              {provider === "gemini"
                ? "API key gratis memiliki batas penggunaan harian. Jika kuota habis, Anda perlu menunggu reset otomatis keesokan hari."
                : "Model gratis memiliki limit harian. Jika kuota habis, Anda bisa membuat API key baru atau upgrade ke versi berbayar."}
            </AlertDescription>
          </Alert>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Provider Selection - Card Style */}
            <div className="space-y-3">
              <Label className="text-sm font-semibold text-slate-700">AI Provider</Label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <motion.button
                  type="button"
                  onClick={() => setValue("provider", "gemini")}
                  whileHover={{ scale: 1.01, y: -2 }}
                  whileTap={{ scale: 0.99 }}
                  className={`relative p-5 rounded-xl border text-left transition-all duration-300 overflow-hidden group
                    ${provider === "gemini"
                      ? "border-indigo-400 bg-gradient-to-br from-indigo-50/80 to-violet-50/50 shadow-lg shadow-indigo-500/10 ring-1 ring-indigo-500/20"
                      : "bg-slate-50/80 border-slate-200/80 hover:border-indigo-300/50 hover:bg-white hover:shadow-md"
                    }`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`flex-shrink-0 w-11 h-11 rounded-xl flex items-center justify-center shadow-sm transition-all duration-300
                      ${provider === "gemini" 
                        ? "bg-gradient-to-br from-blue-500 to-blue-600 shadow-blue-500/25" 
                        : "bg-blue-100 group-hover:bg-blue-200"}`}
                    >
                      <Bot className={`h-5 w-5 transition-colors ${provider === "gemini" ? "text-white" : "text-blue-600"}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`font-semibold text-sm ${provider === "gemini" ? "text-slate-900" : "text-slate-700"}`}>
                          Google Gemini
                        </span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-700 border border-emerald-200/50">
                          Rekomendasi
                        </span>
                      </div>
                      <p className={`text-xs leading-relaxed ${provider === "gemini" ? "text-indigo-700/70" : "text-slate-500"}`}>
                        Model dipilih otomatis berdasarkan ketersediaan
                      </p>
                    </div>
                  </div>
                  {provider === "gemini" && (
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="absolute top-4 right-4 w-6 h-6 rounded-full bg-indigo-500 flex items-center justify-center shadow-lg shadow-indigo-500/30"
                    >
                      <Check className="h-3.5 w-3.5 text-white" />
                    </motion.div>
                  )}
                </motion.button>

                <motion.button
                  type="button"
                  onClick={() => setValue("provider", "openrouter")}
                  whileHover={{ scale: 1.01, y: -2 }}
                  whileTap={{ scale: 0.99 }}
                  className={`relative p-5 rounded-xl border text-left transition-all duration-300 overflow-hidden group
                    ${provider === "openrouter"
                      ? "border-indigo-400 bg-gradient-to-br from-indigo-50/80 to-violet-50/50 shadow-lg shadow-indigo-500/10 ring-1 ring-indigo-500/20"
                      : "bg-slate-50/80 border-slate-200/80 hover:border-indigo-300/50 hover:bg-white hover:shadow-md"
                    }`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`flex-shrink-0 w-11 h-11 rounded-xl flex items-center justify-center shadow-sm transition-all duration-300
                      ${provider === "openrouter" 
                        ? "bg-gradient-to-br from-violet-500 to-violet-600 shadow-violet-500/25" 
                        : "bg-violet-100 group-hover:bg-violet-200"}`}
                    >
                      <Globe className={`h-5 w-5 transition-colors ${provider === "openrouter" ? "text-white" : "text-violet-600"}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className={`font-semibold text-sm block mb-1 ${provider === "openrouter" ? "text-slate-900" : "text-slate-700"}`}>
                        OpenRouter
                      </span>
                      <p className={`text-xs leading-relaxed ${provider === "openrouter" ? "text-indigo-700/70" : "text-slate-500"}`}>
                        Pilih model manual dari berbagai provider
                      </p>
                    </div>
                  </div>
                  {provider === "openrouter" && (
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="absolute top-4 right-4 w-6 h-6 rounded-full bg-indigo-500 flex items-center justify-center shadow-lg shadow-indigo-500/30"
                    >
                      <Check className="h-3.5 w-3.5 text-white" />
                    </motion.div>
                  )}
                </motion.button>
              </div>
            </div>

            {/* Model Selection - Only for OpenRouter */}
            <AnimatePresence mode="wait">
              {showModelSelection && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  className="space-y-3"
                >
                  <Label className="text-sm font-semibold text-slate-700">Model AI</Label>
                  <div className="grid grid-cols-1 gap-3">
                    <motion.button
                      type="button"
                      onClick={() => setValue("model", "google/gemma-4-31b-it:free")}
                      whileHover={{ scale: 1.005, y: -1 }}
                      whileTap={{ scale: 0.995 }}
                      className={`relative p-4 rounded-xl border text-left transition-all duration-300
                        ${model === "google/gemma-4-31b-it:free"
                          ? "border-indigo-400 bg-gradient-to-br from-indigo-50/80 to-violet-50/50 shadow-md ring-1 ring-indigo-500/20"
                          : "bg-slate-50/60 border-slate-200/80 hover:border-indigo-300/50 hover:bg-white"
                        }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center shadow-sm
                          ${model === "google/gemma-4-31b-it:free" ? "bg-gradient-to-br from-blue-500 to-blue-600" : "bg-blue-100"}`}
                        >
                          <Sparkles className={`h-5 w-5 ${model === "google/gemma-4-31b-it:free" ? "text-white" : "text-blue-600"}`} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className={`font-semibold text-sm ${model === "google/gemma-4-31b-it:free" ? "text-slate-900" : "text-slate-700"}`}>
                              Google Gemma 4 31B
                            </span>
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-700 border border-emerald-200/50">
                              Free
                            </span>
                          </div>
                          <p className={`text-xs mt-0.5 ${model === "google/gemma-4-31b-it:free" ? "text-indigo-700/70" : "text-slate-500"}`}>
                            Model gratis dengan performa tinggi untuk PRD
                          </p>
                        </div>
                        {model === "google/gemma-4-31b-it:free" && (
                          <Check className="h-5 w-5 text-indigo-500" />
                        )}
                      </div>
                    </motion.button>

                    <motion.button
                      type="button"
                      onClick={() => setValue("model", "openai/gpt-oss-120b:free")}
                      whileHover={{ scale: 1.005, y: -1 }}
                      whileTap={{ scale: 0.995 }}
                      className={`relative p-4 rounded-xl border text-left transition-all duration-300
                        ${model === "openai/gpt-oss-120b:free"
                          ? "border-indigo-400 bg-gradient-to-br from-indigo-50/80 to-violet-50/50 shadow-md ring-1 ring-indigo-500/20"
                          : "bg-slate-50/60 border-slate-200/80 hover:border-indigo-300/50 hover:bg-white"
                        }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center shadow-sm
                          ${model === "openai/gpt-oss-120b:free" ? "bg-gradient-to-br from-emerald-500 to-emerald-600" : "bg-emerald-100"}`}
                        >
                          <Brain className={`h-5 w-5 ${model === "openai/gpt-oss-120b:free" ? "text-white" : "text-emerald-600"}`} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className={`font-semibold text-sm ${model === "openai/gpt-oss-120b:free" ? "text-slate-900" : "text-slate-700"}`}>
                              OpenAI GPT-OSS 120B
                            </span>
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-700 border border-emerald-200/50">
                              Free
                            </span>
                          </div>
                          <p className={`text-xs mt-0.5 ${model === "openai/gpt-oss-120b:free" ? "text-indigo-700/70" : "text-slate-500"}`}>
                            Model open-source gratis dari OpenAI
                          </p>
                        </div>
                        {model === "openai/gpt-oss-120b:free" && (
                          <Check className="h-5 w-5 text-indigo-500" />
                        )}
                      </div>
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Gemini Auto Model Info */}
            <AnimatePresence>
              {!showModelSelection && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-2"
                >
                  <Label className="text-sm font-semibold text-slate-700">Model AI</Label>
                  <div className="flex items-center gap-4 p-4 rounded-xl border border-slate-200/80 bg-slate-50/60">
                    <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500/10 to-indigo-500/10 flex items-center justify-center border border-blue-200/50">
                      <Bot className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-sm text-slate-800">Auto-Select</p>
                      <p className="text-xs text-slate-500">Google akan memilih model terbaik berdasarkan ketersediaan kuota</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Custom API Key Toggle */}
            <div className="space-y-4 pt-2">
              <motion.div 
                whileHover={{ scale: 1.005 }}
                className={`flex items-center space-x-4 p-5 rounded-xl border cursor-pointer transition-all duration-300
                  ${useCustomKey 
                    ? "border-indigo-400 bg-gradient-to-r from-indigo-50/60 to-violet-50/30 shadow-md ring-1 ring-indigo-500/10" 
                    : "border-slate-200/80 bg-slate-50/60 hover:bg-white hover:border-slate-300/80"}`}
                onClick={() => setUseCustomKey(!useCustomKey)}
              >
                <div className={`flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-200
                  ${useCustomKey 
                    ? "border-indigo-500 bg-indigo-500" 
                    : "border-slate-300 bg-white"}`}
                >
                  {useCustomKey && <Check className="h-3 w-3 text-white" />}
                </div>
                <div className="flex-1">
                  <Label className="text-sm font-semibold text-slate-800 cursor-pointer">
                    Gunakan API Key Sendiri
                  </Label>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {provider === "gemini" 
                      ? "Masukkan API key Gemini Anda sendiri (opsional)" 
                      : "Masukkan API key OpenRouter Anda sendiri (opsional)"}
                  </p>
                </div>
                <Lock className={`h-4 w-4 transition-colors ${useCustomKey ? "text-indigo-500" : "text-slate-400"}`} />
              </motion.div>

              <AnimatePresence>
                {useCustomKey && (
                  <motion.div
                    initial={{ opacity: 0, height: 0, y: -10 }}
                    animate={{ opacity: 1, height: "auto", y: 0 }}
                    exit={{ opacity: 0, height: 0, y: -10 }}
                    transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="space-y-3 pl-4 border-l-2 border-indigo-300/50">
                      <Label htmlFor="apiKey" className="text-sm font-semibold text-slate-700">
                        API Key {provider === "gemini" ? "Gemini" : "OpenRouter"}
                      </Label>
                      <div className="relative">
                        <Input
                          id="apiKey"
                          type={showApiKey ? "text" : "password"}
                          placeholder={provider === "gemini" ? "AIzaSy..." : "sk-or-v1-..."}
                          className="pr-12 bg-white border-slate-200/80 focus:border-indigo-400 focus:ring-indigo-400/20 h-11 rounded-xl"
                          {...register("apiKey")}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-1.5 top-1/2 -translate-y-1/2 h-8 w-8 text-slate-400 hover:text-slate-600 rounded-lg"
                          onClick={() => setShowApiKey(!showApiKey)}
                        >
                          {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                      <p className="text-xs text-slate-500">
                        Dapatkan API key di{" "}
                        <a
                          href={provider === "gemini" ? "https://aistudio.google.com/app/apikey" : "https://openrouter.ai/keys"}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-indigo-600 hover:text-indigo-700 font-semibold hover:underline"
                        >
                          {provider === "gemini" ? "Google AI Studio" : "OpenRouter"}
                        </a>
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Submit Button */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pt-6 border-t border-slate-200/80 gap-4">
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <Shield className="h-4 w-4 text-slate-400" />
                <span>
                  {useCustomKey 
                    ? "API key akan dienkripsi dengan AES-256" 
                    : "Menggunakan API key bawaan aplikasi"}
                </span>
              </div>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  type="submit"
                  className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white shadow-lg shadow-indigo-500/25 h-11 px-6 rounded-xl font-medium"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Menyimpan...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Simpan Konfigurasi
                    </>
                  )}
                </Button>
              </motion.div>
            </div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function ProfileSettings({ profile }: { profile: UserProfile | null }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="border-slate-200/80 shadow-lg shadow-slate-200/50 bg-white/90 backdrop-blur-sm overflow-hidden">
        <CardHeader className="pb-6 border-b border-slate-100">
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-200/50">
              <User className="h-6 w-6 text-emerald-600" />
            </div>
            <div>
              <CardTitle className="text-xl font-semibold text-slate-900">
                Informasi Profil
              </CardTitle>
              <CardDescription className="text-sm text-slate-500 mt-1">
                Detail akun Anda dari Google Account
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6 space-y-6">
          <div className="space-y-5">
            <div className="space-y-2.5">
              <Label className="text-sm font-semibold text-slate-700">Nama Lengkap</Label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  type="text"
                  value={profile?.name || ""}
                  readOnly
                  className="pl-11 bg-slate-50/80 border-slate-200/80 text-slate-600 cursor-not-allowed h-11 rounded-xl"
                />
              </div>
              <p className="text-xs text-slate-500">Nama diambil dari Google Account Anda</p>
            </div>

            <div className="space-y-2.5">
              <Label className="text-sm font-semibold text-slate-700">Email</Label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  type="email"
                  value={profile?.email || ""}
                  readOnly
                  className="pl-11 bg-slate-50/80 border-slate-200/80 text-slate-600 cursor-not-allowed h-11 rounded-xl"
                />
              </div>
              <p className="text-xs text-slate-500">Email digunakan untuk login dan notifikasi</p>
            </div>

            <Alert className="bg-gradient-to-r from-blue-50/80 to-indigo-50/80 border-blue-200/50 text-blue-900 rounded-xl">
              <Info className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-sm text-blue-800/80">
                Profil terhubung dengan Google Account. Untuk mengubah informasi, silakan update di pengaturan Google Anda.
              </AlertDescription>
            </Alert>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function LanguageSettings({ initialLanguage }: { initialLanguage: string }) {
  const [language, setLanguage] = useState(initialLanguage);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSave = async () => {
    setIsLoading(true);
    setIsSuccess(false);
    try {
      const formData = new FormData();
      formData.append("language", language);

      await updateLanguagePreference(formData);
      setIsSuccess(true);
      toast.success("Preferensi bahasa disimpan!", {
        icon: <CheckCircle2 className="h-4 w-4 text-emerald-500" />,
      });
      setTimeout(() => setIsSuccess(false), 3000);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Gagal menyimpan");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="border-slate-200/80 shadow-lg shadow-slate-200/50 bg-white/90 backdrop-blur-sm overflow-hidden">
        <CardHeader className="pb-6 border-b border-slate-100">
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-200/50">
              <Globe className="h-6 w-6 text-amber-600" />
            </div>
            <div>
              <CardTitle className="text-xl font-semibold text-slate-900">
                Preferensi Bahasa
              </CardTitle>
              <CardDescription className="text-sm text-slate-500 mt-1">
                Pilih bahasa default untuk PRD
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <motion.button
              type="button"
              onClick={() => setLanguage("id")}
              whileHover={{ scale: 1.01, y: -2 }}
              whileTap={{ scale: 0.99 }}
              className={`relative p-5 rounded-xl border text-left transition-all duration-300 group
                ${language === "id"
                  ? "border-indigo-400 bg-gradient-to-br from-indigo-50/80 to-violet-50/50 shadow-lg shadow-indigo-500/10 ring-1 ring-indigo-500/20"
                  : "bg-slate-50/80 border-slate-200/80 hover:border-indigo-300/50 hover:bg-white hover:shadow-md"
                }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <span className="text-4xl">🇮🇩</span>
                  <div>
                    <p className={`font-semibold text-sm ${language === "id" ? "text-slate-900" : "text-slate-800"}`}>
                      Bahasa Indonesia
                    </p>
                    <p className={`text-xs mt-0.5 ${language === "id" ? "text-indigo-700/70" : "text-slate-500"}`}>
                      Default untuk PRD
                    </p>
                  </div>
                </div>
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all
                  ${language === "id" 
                    ? "border-indigo-500 bg-indigo-500" 
                    : "border-slate-300 bg-white"}`}
                >
                  {language === "id" && <Check className="h-3.5 w-3.5 text-white" />}
                </div>
              </div>
            </motion.button>

            <motion.button
              type="button"
              onClick={() => setLanguage("en")}
              whileHover={{ scale: 1.01, y: -2 }}
              whileTap={{ scale: 0.99 }}
              className={`relative p-5 rounded-xl border text-left transition-all duration-300 group
                ${language === "en"
                  ? "border-indigo-400 bg-gradient-to-br from-indigo-50/80 to-violet-50/50 shadow-lg shadow-indigo-500/10 ring-1 ring-indigo-500/20"
                  : "bg-slate-50/80 border-slate-200/80 hover:border-indigo-300/50 hover:bg-white hover:shadow-md"
                }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <span className="text-4xl">🇬🇧</span>
                  <div>
                    <p className={`font-semibold text-sm ${language === "en" ? "text-slate-900" : "text-slate-800"}`}>
                      English
                    </p>
                    <p className={`text-xs mt-0.5 ${language === "en" ? "text-indigo-700/70" : "text-slate-500"}`}>
                      English PRD output
                    </p>
                  </div>
                </div>
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all
                  ${language === "en" 
                    ? "border-indigo-500 bg-indigo-500" 
                    : "border-slate-300 bg-white"}`}
                >
                  {language === "en" && <Check className="h-3.5 w-3.5 text-white" />}
                </div>
              </div>
            </motion.button>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pt-6 border-t border-slate-200/80 gap-4">
            <p className="text-sm text-slate-500">
              Bahasa yang dipilih akan menjadi default untuk semua PRD baru
            </p>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                onClick={handleSave}
                className={`shadow-lg transition-all h-11 px-6 rounded-xl font-medium ${
                  isSuccess 
                    ? "bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/25" 
                    : "bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 shadow-indigo-500/25"
                } text-white`}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Menyimpan...
                  </>
                ) : isSuccess ? (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    Tersimpan
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Simpan
                  </>
                )}
              </Button>
            </motion.div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function NotificationSettings({
  initialPrdGenerated,
  initialEmailUpdates,
  initialMarketing,
}: {
  initialPrdGenerated: boolean;
  initialEmailUpdates: boolean;
  initialMarketing: boolean;
}) {
  const [prdGenerated, setPrdGenerated] = useState(initialPrdGenerated);
  const [emailUpdates, setEmailUpdates] = useState(initialEmailUpdates);
  const [marketing, setMarketing] = useState(initialMarketing);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSave = async () => {
    setIsLoading(true);
    setIsSuccess(false);
    try {
      const formData = new FormData();
      formData.append("notifyPrdGenerated", prdGenerated.toString());
      formData.append("notifyEmailUpdates", emailUpdates.toString());
      formData.append("notifyMarketing", marketing.toString());

      await updateNotificationPreferences(formData);
      setIsSuccess(true);
      toast.success("Preferensi notifikasi disimpan!", {
        icon: <CheckCircle2 className="h-4 w-4 text-emerald-500" />,
      });
      setTimeout(() => setIsSuccess(false), 3000);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Gagal menyimpan");
    } finally {
      setIsLoading(false);
    }
  };

  const notificationItems = [
    {
      id: "prd",
      title: "PRD Generated",
      description: "Notifikasi saat PRD selesai dihasilkan",
      checked: prdGenerated,
      onChange: setPrdGenerated,
      icon: FileText,
      color: "text-indigo-600",
      bgColor: "bg-gradient-to-br from-indigo-500/10 to-violet-500/10",
      borderColor: "border-indigo-200/50",
    },
    {
      id: "email",
      title: "Email Updates",
      description: "Update dan pengumuman penting via email",
      checked: emailUpdates,
      onChange: setEmailUpdates,
      icon: Mail,
      color: "text-blue-600",
      bgColor: "bg-gradient-to-br from-blue-500/10 to-indigo-500/10",
      borderColor: "border-blue-200/50",
    },
    {
      id: "marketing",
      title: "Marketing & Tips",
      description: "Tips, trik, dan penawaran spesial",
      checked: marketing,
      onChange: setMarketing,
      icon: Zap,
      color: "text-amber-600",
      bgColor: "bg-gradient-to-br from-amber-500/10 to-orange-500/10",
      borderColor: "border-amber-200/50",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="border-slate-200/80 shadow-lg shadow-slate-200/50 bg-white/90 backdrop-blur-sm overflow-hidden">
        <CardHeader className="pb-6 border-b border-slate-100">
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-rose-500/10 to-pink-500/10 border border-rose-200/50">
              <Bell className="h-6 w-6 text-rose-600" />
            </div>
            <div>
              <CardTitle className="text-xl font-semibold text-slate-900">
                Preferensi Notifikasi
              </CardTitle>
              <CardDescription className="text-sm text-slate-500 mt-1">
                Atur notifikasi yang ingin Anda terima
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6 space-y-6">
          <div className="space-y-3">
            {notificationItems.map((item) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.id}
                  whileHover={{ scale: 1.005, y: -1 }}
                  className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all duration-300
                    ${item.checked 
                      ? "border-indigo-300 bg-gradient-to-r from-indigo-50/70 to-violet-50/40 shadow-sm" 
                      : "border-slate-200/80 bg-slate-50/60 hover:bg-white hover:border-slate-300"}`}
                  onClick={() => item.onChange(!item.checked)}
                >
                  <div className="flex items-center gap-4">
                    <div className={`flex-shrink-0 w-11 h-11 rounded-xl ${item.bgColor} flex items-center justify-center border ${item.borderColor}`}>
                      <Icon className={`h-5 w-5 ${item.color}`} />
                    </div>
                    <div>
                      <p className={`font-semibold text-sm ${item.checked ? "text-slate-900" : "text-slate-700"}`}>
                        {item.title}
                      </p>
                      <p className="text-xs text-slate-500 mt-0.5">{item.description}</p>
                    </div>
                  </div>
                  <div className={`flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-200
                    ${item.checked 
                      ? "border-indigo-500 bg-indigo-500" 
                      : "border-slate-300 bg-white"}`}
                  >
                    {item.checked && <Check className="h-3 w-3 text-white" />}
                  </div>
                </motion.div>
              );
            })}
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pt-6 border-t border-slate-200/80 gap-4">
            <p className="text-sm text-slate-500">
              Anda dapat mengubah preferensi ini kapan saja
            </p>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                onClick={handleSave}
                className={`shadow-lg transition-all h-11 px-6 rounded-xl font-medium ${
                  isSuccess 
                    ? "bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/25" 
                    : "bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 shadow-indigo-500/25"
                } text-white`}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Menyimpan...
                  </>
                ) : isSuccess ? (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    Tersimpan
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Simpan
                  </>
                )}
              </Button>
            </motion.div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

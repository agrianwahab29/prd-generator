"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
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
import { Separator } from "@/components/ui/separator";
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
  model: z.string().optional(), // Optional for Gemini (auto-selected)
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

export default function SettingsPage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
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

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-[#0F172A]">Pengaturan</h2>
          <p className="text-[#475569]">Kelola preferensi akun dan konfigurasi API</p>
        </div>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-[#4F46E5]" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-[#0F172A]">Pengaturan</h2>
        <p className="text-[#475569]">
          Kelola preferensi akun dan konfigurasi API
        </p>
      </div>

      <Tabs defaultValue="api" className="w-full">
        <TabsList className="bg-white border border-[#E2E8F0] mb-6 overflow-x-auto scrollbar-thin">
          <TabsTrigger value="api" className="data-[state=active]:bg-[#EEF2FF] data-[state=active]:text-[#4F46E5]">
            <Key className="h-4 w-4 mr-2" />
            API Key
          </TabsTrigger>
          <TabsTrigger value="profile" className="data-[state=active]:bg-[#EEF2FF] data-[state=active]:text-[#4F46E5]">
            <Settings className="h-4 w-4 mr-2" />
            Profil
          </TabsTrigger>
          <TabsTrigger value="language" className="data-[state=active]:bg-[#EEF2FF] data-[state=active]:text-[#4F46E5]">
            <Globe className="h-4 w-4 mr-2" />
            Bahasa
          </TabsTrigger>
          <TabsTrigger value="notifications" className="data-[state=active]:bg-[#EEF2FF] data-[state=active]:text-[#4F46E5]">
            <Bell className="h-4 w-4 mr-2" />
            Notifikasi
          </TabsTrigger>
        </TabsList>

        <TabsContent value="api" className="space-y-6">
          <ApiKeySettings initialSettings={settings} />
        </TabsContent>

        <TabsContent value="profile" className="space-y-6">
          <ProfileSettings profile={profile} />
        </TabsContent>

        <TabsContent value="language" className="space-y-6">
          <LanguageSettings initialLanguage={settings?.language || "id"} />
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <NotificationSettings
            initialPrdGenerated={settings?.notifyPrdGenerated ?? true}
            initialEmailUpdates={settings?.notifyEmailUpdates ?? true}
            initialMarketing={settings?.notifyMarketing ?? false}
          />
        </TabsContent>
      </Tabs>
    </div>
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

  // Only OpenRouter needs model selection - Gemini auto-selects the best model
  const showModelSelection = provider === "openrouter";

  // Reset model when provider changes
  useEffect(() => {
    if (provider === "gemini") {
      setValue("model", "auto");
    } else {
      setValue("model", "google/gemma-4-31b-it:free");
    }
  }, [provider, setValue]);

  // OpenRouter free models only
  const modelOptions = [
    {
      value: "google/gemma-4-31b-it:free",
      label: "Google Gemma 4 31B",
      description: "Model gratis, performa tinggi untuk PRD",
      badge: "Free",
      badgeColor: "bg-[#F0FDF4] text-[#166534] border border-[#BBF7D0]",
      icon: Sparkles,
      iconColor: "text-[#4285F4]",
      iconBg: "bg-[#EEF2FF]",
    },
    {
      value: "openai/gpt-oss-120b:free",
      label: "OpenAI GPT-OSS 120B",
      description: "Model open-source gratis dari OpenAI",
      badge: "Free",
      badgeColor: "bg-[#F0FDF4] text-[#166534] border border-[#BBF7D0]",
      icon: Brain,
      iconColor: "text-[#10A37F]",
      iconBg: "bg-[#F0FDF4]",
    },
  ];

  const onSubmit = async (data: ApiKeyForm) => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      // Only send API key if using custom key
      if (useCustomKey && data.apiKey) {
        formData.append("apiKey", data.apiKey);
      } else {
        formData.append("apiKey", ""); // Use default
      }
      formData.append("provider", data.provider);
      // For Gemini, model is auto-selected; for OpenRouter, use selected model
      const selectedModel = data.provider === "gemini" ? "auto" : (data.model || "google/gemma-4-31b-it:free");
      formData.append("model", selectedModel);

      await updateApiKey(formData);
      toast.success("Konfigurasi API berhasil disimpan!");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Gagal menyimpan konfigurasi API");
    } finally {
      setIsLoading(false);
    }
  };

  const providerOptions = [
    {
      value: "gemini",
      label: "Google Gemini",
      description: "Model AI terbaik untuk PRD generation",
      badge: "Recommended",
      badgeColor: "bg-[#F0FDF4] text-[#166534] border border-[#BBF7D0]",
      icon: Bot,
      iconColor: "text-[#4285F4]",
      iconBg: "bg-[#EEF2FF]",
    },
    {
      value: "openrouter",
      label: "OpenRouter",
      description: "Akses berbagai model AI populer",
      badge: "",
      badgeColor: "",
      icon: Globe,
      iconColor: "text-[#6366F1]",
      iconBg: "bg-[#EEF2FF]",
    },
  ];

  const providerInfo = provider === "gemini"
    ? {
        name: "Google Gemini",
        description: "Gunakan Google Gemini API untuk menghasilkan PRD. Model AI dipilih otomatis oleh Google berdasarkan ketersediaan kuota gratis. Anda bisa menggunakan API key bawaan aplikasi atau API key Gemini Anda sendiri.",
        customKeyLabel: "Gunakan API key Gemini sendiri (opsional)",
        customKeyPlaceholder: "AIzaSy...",
        customKeyHint: "Dapatkan API key di",
        customKeyUrl: "https://aistudio.google.com/app/apikey",
        customKeyUrlText: "aistudio.google.com/app/apikey",
        modelInfo: "Model dipilih otomatis oleh Google Gemini",
        resetInfo: "API key gratis Gemini memiliki batas penggunaan harian. Jika habis, Anda bisa membuat API key baru di Google AI Studio atau menunggu reset otomatis keesokan harinya.",
      }
    : {
        name: "OpenRouter",
        description: "Gunakan OpenRouter untuk mengakses berbagai model AI gratis. Pilih model yang tersedia di bawah. Anda bisa menggunakan API key bawaan aplikasi atau API key OpenRouter Anda sendiri.",
        customKeyLabel: "Gunakan API key OpenRouter sendiri (opsional)",
        customKeyPlaceholder: "sk-or-v1-...",
        customKeyHint: "Dapatkan API key di",
        customKeyUrl: "https://openrouter.ai/keys",
        customKeyUrlText: "openrouter.ai/keys",
        modelInfo: "Pilih salah satu model gratis yang tersedia",
        resetInfo: "Model gratis OpenRouter memiliki limit harian. Jika habis, Anda bisa membuat API key baru atau upgrade ke versi berbayar untuk limit lebih tinggi.",
      };

  return (
    <Card className="border-[#E2E8F0]">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-[#0F172A] flex items-center gap-2">
          <Key className="h-5 w-5 text-[#4F46E5]" />
          Konfigurasi AI Provider
        </CardTitle>
        <CardDescription>
          Atur provider AI dan API key untuk menghasilkan PRD. Anda bisa menggunakan API key bawaan aplikasi atau menggunakan API key sendiri.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Alert className="mb-6 bg-[#EEF2FF] border-[#C7D2FE] text-[#3730A3]">
          <Info className="h-4 w-4" />
          <AlertDescription>
            {provider === "gemini"
              ? "Google Gemini menyediakan API key gratis dengan limit harian. Jika kuota habis, buat API key baru di Google AI Studio atau tunggu reset otomatis keesokan hari."
              : "OpenRouter menyediakan model gratis dengan limit harian. Jika kuota habis, buat API key baru atau upgrade untuk limit lebih tinggi."}
          </AlertDescription>
        </Alert>

        <Alert className="mb-6 bg-[#FFFBEB] border-[#FDE68A] text-[#92400E]">
          <Zap className="h-4 w-4" />
          <AlertDescription className="text-sm">
            <strong>Peringatan API Gratis:</strong> {providerInfo.resetInfo}
          </AlertDescription>
        </Alert>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="provider" className="text-[#334155]">
              AI Provider
            </Label>
            <Select
              value={provider}
              onValueChange={(value) => setValue("provider", value)}
            >
              <SelectTrigger className="border-[#E2E8F0] focus:border-[#4F46E5] focus:ring-[#4F46E5] h-auto py-3">
                <SelectValue placeholder="Pilih provider" />
              </SelectTrigger>
              <SelectContent className="min-w-[300px]">
                {providerOptions.map((option) => {
                  const IconComponent = option.icon;
                  return (
                    <SelectItem
                      key={option.value}
                      value={option.value}
                      className="py-2.5 px-2"
                    >
                      <div className="flex items-center gap-3 w-full">
                        <div className={`flex-shrink-0 h-8 w-8 rounded-md ${option.iconBg} flex items-center justify-center`}>
                          <IconComponent className={`h-4 w-4 ${option.iconColor}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-[#0F172A] text-sm">
                              {option.label}
                            </span>
                            {option.badge && (
                              <span className={`inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-medium ${option.badgeColor}`}>
                                {option.badge}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-[#64748B] mt-0.5 truncate">
                            {option.description}
                          </p>
                        </div>
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
            {errors.provider && (
              <p className="text-sm text-[#F43F5E]">{errors.provider.message}</p>
            )}
          </div>

          {showModelSelection && (
            <div className="space-y-2">
              <Label htmlFor="model" className="text-[#334155]">
                Model AI ({providerInfo.modelInfo})
              </Label>
              <Select
                value={model}
                onValueChange={(value) => setValue("model", value)}
              >
                <SelectTrigger className="border-[#E2E8F0] focus:border-[#4F46E5] focus:ring-[#4F46E5] h-auto py-3">
                  <SelectValue placeholder="Pilih model" />
                </SelectTrigger>
                <SelectContent className="min-w-[300px]">
                  {modelOptions.map((option) => {
                    const IconComponent = option.icon;
                    return (
                      <SelectItem
                        key={option.value}
                        value={option.value}
                        className="py-2.5 px-2"
                      >
                        <div className="flex items-center gap-3 w-full">
                          <div className={`flex-shrink-0 h-8 w-8 rounded-md ${option.iconBg} flex items-center justify-center`}>
                            <IconComponent className={`h-4 w-4 ${option.iconColor}`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-[#0F172A] text-sm">
                                {option.label}
                              </span>
                              {option.badge && (
                                <span className={`inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-medium ${option.badgeColor}`}>
                                  {option.badge}
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-[#64748B] mt-0.5 truncate">
                              {option.description}
                            </p>
                          </div>
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
              {errors.model && (
                <p className="text-sm text-[#F43F5E]">{errors.model.message}</p>
              )}
            </div>
          )}

          {!showModelSelection && (
            <div className="space-y-2">
              <Label className="text-[#334155]">
                Model AI
              </Label>
              <div className="flex items-center gap-2 p-3 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC]">
                <Bot className="h-4 w-4 text-[#4285F4]" />
                <span className="text-sm text-[#64748B]">
                  {providerInfo.modelInfo}
                </span>
              </div>
            </div>
          )}

          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="useCustomKey"
                checked={useCustomKey}
                onCheckedChange={(checked) => setUseCustomKey(checked as boolean)}
              />
              <Label htmlFor="useCustomKey" className="text-[#334155] cursor-pointer">
                {providerInfo.customKeyLabel}
              </Label>
            </div>

            {useCustomKey && (
              <div className="space-y-2 pl-6">
                <Label htmlFor="apiKey" className="text-[#334155]">
                  API Key {provider === "gemini" ? "Gemini" : "OpenRouter"}
                </Label>
                <div className="relative">
                  <Input
                    id="apiKey"
                    type={showApiKey ? "text" : "password"}
                    placeholder={providerInfo.customKeyPlaceholder}
                    className="pr-10 border-[#E2E8F0] focus:border-[#4F46E5] focus:ring-[#4F46E5]"
                    {...register("apiKey")}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3 text-[#64748B] hover:text-[#0F172A]"
                    onClick={() => setShowApiKey(!showApiKey)}
                  >
                    {showApiKey ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                <p className="text-sm text-[#64748B]">
                  {providerInfo.customKeyHint}{' '}
                  <a
                    href={providerInfo.customKeyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#4F46E5] hover:underline"
                  >
                    {providerInfo.customKeyUrlText}
                  </a>
                </p>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-[#E2E8F0]">
            <div className="text-sm text-[#64748B]">
              <Shield className="inline h-4 w-4 mr-1" />
              {useCustomKey ? "API key akan dienkripsi dengan AES-256" : "Menggunakan API key bawaan aplikasi"}
            </div>
            <Button
              type="submit"
              className="bg-[#4F46E5] hover:bg-[#4338CA] text-white"
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
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

function ProfileSettings({ profile }: { profile: UserProfile | null }) {
  return (
    <Card className="border-[#E2E8F0]">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-[#0F172A] flex items-center gap-2">
          <User className="h-5 w-5 text-[#4F46E5]" />
          Informasi Profil
        </CardTitle>
        <CardDescription>
          Informasi profil Anda dari Google Account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-[#334155]">
              Nama Lengkap
            </Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#64748B]" />
              <Input
                id="name"
                type="text"
                value={profile?.name || ""}
                readOnly
                className="pl-10 border-[#E2E8F0] bg-[#F8FAFC] text-[#64748B]"
              />
            </div>
            <p className="text-sm text-[#64748B]">
              Nama diambil dari Google Account Anda
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-[#334155]">
              Email
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#64748B]" />
              <Input
                id="email"
                type="email"
                value={profile?.email || ""}
                readOnly
                className="pl-10 border-[#E2E8F0] bg-[#F8FAFC] text-[#64748B]"
              />
            </div>
            <p className="text-sm text-[#64748B]">
              Email digunakan untuk login dan notifikasi
            </p>
          </div>

          <Alert className="bg-[#F0FDF4] border-[#BBF7D0] text-[#166534]">
            <Info className="h-4 w-4" />
            <AlertDescription>
              Profil dihubungkan dengan Google Account. Untuk mengubah nama atau email, silakan update di pengaturan Google Account Anda.
            </AlertDescription>
          </Alert>
        </div>
      </CardContent>
    </Card>
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
      toast.success("Preferensi bahasa berhasil disimpan!");
      setTimeout(() => setIsSuccess(false), 3000);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Gagal menyimpan preferensi bahasa");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="border-[#E2E8F0]">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-[#0F172A] flex items-center gap-2">
          <Globe className="h-5 w-5 text-[#4F46E5]" />
          Preferensi Bahasa
        </CardTitle>
        <CardDescription>
          Pilih bahasa default untuk PRD yang dihasilkan
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div
            className={`flex items-center justify-between p-4 rounded-lg border cursor-pointer transition-colors ${
              language === "id"
                ? "border-[#4F46E5] bg-[#EEF2FF]"
                : "border-[#E2E8F0] bg-white hover:border-[#4F46E5]/50"
            }`}
            onClick={() => setLanguage("id")}
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">🇮🇩</span>
              <div>
                <p className="font-medium text-[#0F172A]">Bahasa Indonesia</p>
                <p className="text-sm text-[#64748B]">Default untuk PRD</p>
              </div>
            </div>
            <div
              className={`h-4 w-4 rounded-full border-2 ${
                language === "id"
                  ? "border-[#4F46E5] bg-[#4F46E5]"
                  : "border-[#CBD5E1]"
              }`}
            >
              {language === "id" && (
                <div className="h-full w-full flex items-center justify-center">
                  <div className="h-1.5 w-1.5 rounded-full bg-white" />
                </div>
              )}
            </div>
          </div>

          <div
            className={`flex items-center justify-between p-4 rounded-lg border cursor-pointer transition-colors ${
              language === "en"
                ? "border-[#4F46E5] bg-[#EEF2FF]"
                : "border-[#E2E8F0] bg-white hover:border-[#4F46E5]/50"
            }`}
            onClick={() => setLanguage("en")}
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">🇬🇧</span>
              <div>
                <p className="font-medium text-[#0F172A]">English</p>
                <p className="text-sm text-[#64748B]">English language PRD</p>
              </div>
            </div>
            <div
              className={`h-4 w-4 rounded-full border-2 ${
                language === "en"
                  ? "border-[#4F46E5] bg-[#4F46E5]"
                  : "border-[#CBD5E1]"
              }`}
            >
              {language === "en" && (
                <div className="h-full w-full flex items-center justify-center">
                  <div className="h-1.5 w-1.5 rounded-full bg-white" />
                </div>
              )}
            </div>
          </div>
        </div>

        <Separator className="bg-[#E2E8F0]" />

        <div className="flex items-center justify-between">
          <div className="text-sm text-[#64748B]">
            Bahasa yang dipilih akan menjadi default untuk semua PRD baru
          </div>
          <Button
            onClick={handleSave}
            className="bg-[#4F46E5] hover:bg-[#4338CA] text-white"
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
        </div>
      </CardContent>
    </Card>
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
      toast.success("Preferensi notifikasi berhasil disimpan!");
      setTimeout(() => setIsSuccess(false), 3000);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Gagal menyimpan preferensi notifikasi");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="border-[#E2E8F0]">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-[#0F172A] flex items-center gap-2">
          <Bell className="h-5 w-5 text-[#4F46E5]" />
          Preferensi Notifikasi
        </CardTitle>
        <CardDescription>
          Atur notifikasi yang ingin Anda terima
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-lg border border-[#E2E8F0] bg-white">
            <div>
              <p className="font-medium text-[#0F172A]">PRD Generated</p>
              <p className="text-sm text-[#64748B]">
                Notifikasi saat PRD selesai dihasilkan
              </p>
            </div>
            <Checkbox
              checked={prdGenerated}
              onCheckedChange={(checked) => setPrdGenerated(checked as boolean)}
              className="h-5 w-5"
            />
          </div>

          <div className="flex items-center justify-between p-4 rounded-lg border border-[#E2E8F0] bg-white">
            <div>
              <p className="font-medium text-[#0F172A]">Email Updates</p>
              <p className="text-sm text-[#64748B]">
                Update dan pengumuman penting via email
              </p>
            </div>
            <Checkbox
              checked={emailUpdates}
              onCheckedChange={(checked) => setEmailUpdates(checked as boolean)}
              className="h-5 w-5"
            />
          </div>

          <div className="flex items-center justify-between p-4 rounded-lg border border-[#E2E8F0] bg-white">
            <div>
              <p className="font-medium text-[#0F172A]">Marketing</p>
              <p className="text-sm text-[#64748B]">
                Tips, trik, dan penawaran spesial
              </p>
            </div>
            <Checkbox
              checked={marketing}
              onCheckedChange={(checked) => setMarketing(checked as boolean)}
              className="h-5 w-5"
            />
          </div>
        </div>

        <Separator className="my-6 bg-[#E2E8F0]" />

        <div className="flex items-center justify-between">
          <div className="text-sm text-[#64748B]">
            Anda dapat mengubah preferensi ini kapan saja
          </div>
          <Button
            onClick={handleSave}
            className="bg-[#4F46E5] hover:bg-[#4338CA] text-white"
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
        </div>
      </CardContent>
    </Card>
  );
}

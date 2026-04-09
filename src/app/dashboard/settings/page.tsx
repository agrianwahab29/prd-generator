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
import {
  Settings,
  Key,
  Globe,
  Bell,
  Shield,
  Eye,
  EyeOff,
  Save,
  AlertTriangle,
  Loader2,
  Check,
} from "lucide-react";
import { toast } from "sonner";
import { updateApiKey, getUserSettings } from "@/app/actions/settings";

const apiKeySchema = z.object({
  apiKey: z.string().min(1, "API Key wajib diisi"),
  provider: z.string().min(1, "Pilih provider"),
});

const profileSchema = z.object({
  name: z.string().min(2, "Nama minimal 2 karakter"),
  email: z.string().email("Email tidak valid"),
});

type ApiKeyForm = z.infer<typeof apiKeySchema>;
type ProfileForm = z.infer<typeof profileSchema>;

export default function SettingsPage() {
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
        <TabsList className="bg-white border border-[#E2E8F0] mb-6">
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
          <ApiKeySettings />
        </TabsContent>

        <TabsContent value="profile" className="space-y-6">
          <ProfileSettings />
        </TabsContent>

        <TabsContent value="language" className="space-y-6">
          <LanguageSettings />
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <NotificationSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function ApiKeySettings() {
  const [showApiKey, setShowApiKey] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ApiKeyForm>({
    resolver: zodResolver(apiKeySchema),
  });

  const provider = watch("provider");

  useEffect(() => {
    getUserSettings().then((settings) => {
      if (settings?.apiProvider) {
        setValue("provider", settings.apiProvider);
      }
    });
  }, [setValue]);

  const onSubmit = async (data: ApiKeyForm) => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("apiKey", data.apiKey);
      formData.append("provider", data.provider);
      
      await updateApiKey(formData);
      toast.success("API Key berhasil disimpan!");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Gagal menyimpan API Key");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="border-[#E2E8F0]">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-[#0F172A] flex items-center gap-2">
          <Key className="h-5 w-5 text-[#4F46E5]" />
          Konfigurasi API Key
        </CardTitle>
        <CardDescription>
          Atur API key untuk mengakses layanan AI. API key akan dienkripsi dan disimpan dengan aman.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Alert className="mb-6 bg-[#FFFBEB] border-[#FEF3C7] text-[#92400E]">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            API key Anda akan dienkripsi sebelum disimpan. Jangan bagikan API key dengan siapapun.
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
              <SelectTrigger className="border-[#E2E8F0] focus:border-[#4F46E5] focus:ring-[#4F46E5]">
                <SelectValue placeholder="Pilih provider" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="openai">OpenAI (GPT-4)</SelectItem>
                <SelectItem value="anthropic">Anthropic (Claude)</SelectItem>
                <SelectItem value="google">Google (Gemini)</SelectItem>
                <SelectItem value="groq">Groq (Mixtral/Llama)</SelectItem>
              </SelectContent>
            </Select>
            {errors.provider && (
              <p className="text-sm text-[#F43F5E]">{errors.provider.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="apiKey" className="text-[#334155]">
              API Key
            </Label>
            <div className="relative">
              <Input
                id="apiKey"
                type={showApiKey ? "text" : "password"}
                placeholder="sk-..."
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
            {errors.apiKey && (
              <p className="text-sm text-[#F43F5E]">{errors.apiKey.message}</p>
            )}
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-[#E2E8F0]">
            <div className="text-sm text-[#64748B]">
              <Shield className="inline h-4 w-4 mr-1" />
              Terenkripsi dengan AES-256
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
                  Simpan API Key
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

function ProfileSettings() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: "John Doe",
      email: "john@example.com",
    },
  });

  const onSubmit = async (data: ProfileForm) => {
    setIsLoading(true);
    setIsSuccess(false);
    try {
      // TODO: Implement profile update
      console.log("Profile data:", data);
      setIsSuccess(true);
      toast.success("Profil berhasil diperbarui!");
      setTimeout(() => setIsSuccess(false), 3000);
    } catch (error) {
      toast.error("Gagal memperbarui profil");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="border-[#E2E8F0]">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-[#0F172A]">
          Informasi Profil
        </CardTitle>
        <CardDescription>
          Perbarui informasi pribadi Anda
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-[#334155]">
              Nama Lengkap
            </Label>
            <Input
              id="name"
              type="text"
              className="border-[#E2E8F0] focus:border-[#4F46E5] focus:ring-[#4F46E5]"
              {...register("name")}
            />
            {errors.name && (
              <p className="text-sm text-[#F43F5E]">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-[#334155]">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              className="border-[#E2E8F0] focus:border-[#4F46E5] focus:ring-[#4F46E5]"
              {...register("email")}
            />
            {errors.email && (
              <p className="text-sm text-[#F43F5E]">{errors.email.message}</p>
            )}
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-[#E2E8F0]">
            <div className="text-sm text-[#64748B]">
              Email digunakan untuk login dan notifikasi
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
              ) : isSuccess ? (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  Tersimpan
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Simpan Perubahan
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

function LanguageSettings() {
  const [language, setLanguage] = useState("id");

  const handleSave = () => {
    toast.success("Preferensi bahasa disimpan!");
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
          <div className="flex items-center justify-between p-4 rounded-lg border border-[#E2E8F0] bg-white">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🇮🇩</span>
              <div>
                <p className="font-medium text-[#0F172A]">Bahasa Indonesia</p>
                <p className="text-sm text-[#64748B]">Default untuk PRD</p>
              </div>
            </div>
            <input
              type="radio"
              name="language"
              value="id"
              checked={language === "id"}
              onChange={(e) => setLanguage(e.target.value)}
              className="h-4 w-4 text-[#4F46E5]"
            />
          </div>

          <div className="flex items-center justify-between p-4 rounded-lg border border-[#E2E8F0] bg-white">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🇬🇧</span>
              <div>
                <p className="font-medium text-[#0F172A]">English</p>
                <p className="text-sm text-[#64748B]">English language PRD</p>
              </div>
            </div>
            <input
              type="radio"
              name="language"
              value="en"
              checked={language === "en"}
              onChange={(e) => setLanguage(e.target.value)}
              className="h-4 w-4 text-[#4F46E5]"
            />
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
          >
            <Save className="h-4 w-4 mr-2" />
            Simpan
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function NotificationSettings() {
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
            <input
              type="checkbox"
              defaultChecked
              className="h-4 w-4 rounded border-[#E2E8F0] text-[#4F46E5]"
            />
          </div>

          <div className="flex items-center justify-between p-4 rounded-lg border border-[#E2E8F0] bg-white">
            <div>
              <p className="font-medium text-[#0F172A]">Email Updates</p>
              <p className="text-sm text-[#64748B]">
                Update dan pengumuman penting via email
              </p>
            </div>
            <input
              type="checkbox"
              defaultChecked
              className="h-4 w-4 rounded border-[#E2E8F0] text-[#4F46E5]"
            />
          </div>

          <div className="flex items-center justify-between p-4 rounded-lg border border-[#E2E8F0] bg-white">
            <div>
              <p className="font-medium text-[#0F172A]">Marketing</p>
              <p className="text-sm text-[#64748B]">
                Tips, trik, dan penawaran spesial
              </p>
            </div>
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-[#E2E8F0] text-[#4F46E5]"
            />
          </div>
        </div>

        <Separator className="my-6 bg-[#E2E8F0]" />

        <div className="flex items-center justify-between">
          <div className="text-sm text-[#64748B]">
            Anda dapat mengubah preferensi ini kapan saja
          </div>
          <Button
            onClick={() => toast.success("Preferensi notifikasi disimpan!")}
            className="bg-[#4F46E5] hover:bg-[#4338CA] text-white"
          >
            <Save className="h-4 w-4 mr-2" />
            Simpan
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

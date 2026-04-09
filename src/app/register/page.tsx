"use client";

import { useState } from "react";
import Link from "next/link";
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
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { FileText, Loader2, Check } from "lucide-react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth/auth-client";

const registerSchema = z.object({
  name: z.string().min(2, "Nama minimal 2 karakter"),
  email: z.string().email("Email tidak valid"),
  password: z.string().min(8, "Password minimal 8 karakter"),
  confirmPassword: z.string(),
  acceptTerms: z.boolean().refine((val) => val === true, {
    message: "Anda harus menyetujui syarat dan ketentuan",
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Password tidak cocok",
  path: ["confirmPassword"],
});

type RegisterForm = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      acceptTerms: false,
    },
  });

  const acceptTerms = watch("acceptTerms");

  const onSubmit = async (data: RegisterForm) => {
    setIsLoading(true);
    try {
      const result = await authClient.signUp.email({
        name: data.name,
        email: data.email,
        password: data.password,
      });

      if (result.error) {
        toast.error("Pendaftaran gagal", {
          description: result.error.message || "Terjadi kesalahan",
        });
        return;
      }

      toast.success("Pendaftaran berhasil!", {
        description: "Silakan masuk dengan akun Anda",
      });
      window.location.href = "/login";
    } catch (error) {
      toast.error("Pendaftaran gagal", {
        description: "Terjadi kesalahan. Silakan coba lagi.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#EEF2FF] to-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="mb-8 text-center">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#4F46E5] shadow-lg">
              <FileText className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-[#020617]">
              AI PRD Generator
            </span>
          </Link>
        </div>

        <Card className="border-[#E2E8F0] shadow-xl">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl font-bold text-[#0F172A]">
              Buat Akun Baru
            </CardTitle>
            <CardDescription className="text-[#475569]">
              Mulai membuat PRD profesional secara gratis
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* OAuth Buttons */}
            <div className="grid gap-3">
              <Button
                variant="outline"
                className="h-11 border-[#E2E8F0] hover:bg-[#F8FAFC]"
                disabled={isLoading}
                onClick={() => authClient.signIn.social({ provider: "google", callbackURL: "/dashboard" })}
              >
                <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                Daftar dengan Google
              </Button>
              <Button
                variant="outline"
                className="h-11 border-[#E2E8F0] hover:bg-[#F8FAFC]"
                disabled={isLoading}
                onClick={() => authClient.signIn.social({ provider: "github", callbackURL: "/dashboard" })}
              >
                <svg className="mr-2 h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                Daftar dengan GitHub
              </Button>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator className="w-full bg-[#E2E8F0]" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-[#64748B]">
                  Atau daftar dengan email
                </span>
              </div>
            </div>

            {/* Registration Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-[#334155]">
                  Nama Lengkap
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  className="h-11 border-[#E2E8F0] focus:border-[#4F46E5] focus:ring-[#4F46E5]"
                  disabled={isLoading}
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
                  placeholder="nama@email.com"
                  className="h-11 border-[#E2E8F0] focus:border-[#4F46E5] focus:ring-[#4F46E5]"
                  disabled={isLoading}
                  {...register("email")}
                />
                {errors.email && (
                  <p className="text-sm text-[#F43F5E]">{errors.email.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-[#334155]">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  className="h-11 border-[#E2E8F0] focus:border-[#4F46E5] focus:ring-[#4F46E5]"
                  disabled={isLoading}
                  {...register("password")}
                />
                {errors.password && (
                  <p className="text-sm text-[#F43F5E]">
                    {errors.password.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-[#334155]">
                  Konfirmasi Password
                </Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  className="h-11 border-[#E2E8F0] focus:border-[#4F46E5] focus:ring-[#4F46E5]"
                  disabled={isLoading}
                  {...register("confirmPassword")}
                />
                {errors.confirmPassword && (
                  <p className="text-sm text-[#F43F5E]">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>
              <div className="flex items-start space-x-2">
                <Checkbox
                  id="acceptTerms"
                  checked={acceptTerms}
                  onCheckedChange={(checked) =>
                    setValue("acceptTerms", checked as boolean)
                  }
                  disabled={isLoading}
                />
                <Label
                  htmlFor="acceptTerms"
                  className="text-sm text-[#475569] font-normal leading-relaxed cursor-pointer"
                >
                  Saya menyetujui{" "}
                  <Link
                    href="/terms"
                    className="text-[#4F46E5] hover:underline"
                  >
                    Syarat
                  </Link>{" "}
                  dan{" "}
                  <Link
                    href="/privacy"
                    className="text-[#4F46E5] hover:underline"
                  >
                    Kebijakan Privasi
                  </Link>
                </Label>
              </div>
              {errors.acceptTerms && (
                <p className="text-sm text-[#F43F5E]">
                  {errors.acceptTerms.message}
                </p>
              )}
              <Button
                type="submit"
                className="w-full h-11 bg-[#F97316] hover:bg-[#EA580C] text-white"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Mendaftar...
                  </>
                ) : (
                  "Daftar Gratis"
                )}
              </Button>
            </form>

            <div className="text-center text-sm text-[#475569]">
              Sudah punya akun?{" "}
              <Link
                href="/login"
                className="font-semibold text-[#4F46E5] hover:underline"
              >
                Masuk
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Features */}
        <div className="mt-8 grid grid-cols-3 gap-4 text-center">
          <div className="flex flex-col items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#ECFDF5]">
              <Check className="h-5 w-5 text-[#10B981]" />
            </div>
            <span className="text-xs text-[#64748B]">Free tier</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#ECFDF5]">
              <Check className="h-5 w-5 text-[#10B981]" />
            </div>
            <span className="text-xs text-[#64748B]">Tanpa kartu kredit</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#ECFDF5]">
              <Check className="h-5 w-5 text-[#10B981]" />
            </div>
            <span className="text-xs text-[#64748B]">Batal kapan saja</span>
          </div>
        </div>
      </div>
    </div>
  );
}

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
import { FileText, Loader2, Mail, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

const forgotPasswordSchema = z.object({
  email: z.string().email("Email tidak valid"),
});

type ForgotPasswordForm = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordForm>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordForm) => {
    setIsLoading(true);
    try {
      // Note: Password reset functionality needs to be implemented
      // This is a placeholder for the UI - actual API integration pending
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setIsSuccess(true);
      toast.success("Fitur dalam pengembangan", {
        description: "Silakan hubungi support untuk bantuan reset password",
      });
    } catch (error) {
      toast.error("Terjadi kesalahan", {
        description: "Silakan coba lagi nanti",
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
              Lupa Password?
            </CardTitle>
            <CardDescription className="text-[#475569]">
              Hubungi support kami untuk bantuan reset password
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col items-center gap-4 py-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#FEF3C7]">
                <Mail className="h-8 w-8 text-[#F59E0B]" />
              </div>
              <div className="text-center space-y-2">
                <p className="text-[#475569]">
                  Untuk sementara, silakan hubungi tim support kami untuk reset password.
                </p>
                <p className="text-sm text-[#64748B]">
                  Kami akan membantu Anda mengembalikan akses ke akun.
                </p>
              </div>
            </div>

            {/* Email form for future implementation */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-[#334155]">
                  Email Akun Anda
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
              <Button
                type="submit"
                className="w-full h-11 bg-[#4F46E5] hover:bg-[#4338CA] text-white"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Memproses...
                  </>
                ) : (
                  "Hubungi Support"
                )}
              </Button>
            </form>

            <div className="text-center">
              <Link
                href="/login"
                className="inline-flex items-center gap-2 text-sm text-[#4F46E5] hover:underline"
              >
                <ArrowLeft className="h-4 w-4" />
                Kembali ke Login
              </Link>
            </div>
          </CardContent>
        </Card>

        <p className="mt-6 text-center text-sm text-[#64748B]">
          Butuh bantuan?{" "}
          <a
            href="mailto:support@prdgenerator.com"
            className="text-[#4F46E5] hover:underline"
          >
            support@prdgenerator.com
          </a>
        </p>
      </div>
    </div>
  );
}

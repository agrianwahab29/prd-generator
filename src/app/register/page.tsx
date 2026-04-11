"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { FileText, Loader2, Check } from "lucide-react";
import { authClient } from "@/lib/auth/auth-client";

export default function RegisterPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);

  const handleGoogleSignUp = async () => {
    if (!acceptTerms) {
      return;
    }
    setIsLoading(true);
    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/dashboard",
      });
    } catch {
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
            {/* Google Button */}
            <Button
              variant="outline"
              className="h-12 border-[#E2E8F0] hover:bg-[#F8FAFC] w-full"
              disabled={isLoading || !acceptTerms}
              onClick={handleGoogleSignUp}
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
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Menghubungkan...
                </>
              ) : (
                "Daftar dengan Google"
              )}
            </Button>

            <div className="flex items-start space-x-2">
              <Checkbox
                id="acceptTerms"
                checked={acceptTerms}
                onCheckedChange={(checked) =>
                  setAcceptTerms(checked as boolean)
                }
                disabled={isLoading}
              />
              <label
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
              </label>
            </div>

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

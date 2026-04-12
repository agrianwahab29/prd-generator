"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Home, RefreshCw } from "lucide-react";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error to console (in production, you'd send to Sentry)
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FEF2F2] to-white flex items-center justify-center p-4 animate-fade-in">
      <div className="max-w-md w-full text-center animate-slide-up">
        {/* Error Icon */}
        <div className="mb-6">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#FEE2E2] mx-auto">
            <AlertTriangle className="h-10 w-10 text-[#DC2626]" />
          </div>
        </div>

        {/* Content */}
        <h1 className="text-2xl font-bold text-[#0F172A] mb-3">
          Terjadi Kesalahan
        </h1>
        <p className="text-[#475569] mb-6">
          Maaf, sistem mengalami masalah. Tim kami telah diberitahu tentang error ini.
        </p>

        {/* Error Details (development only) */}
        {process.env.NODE_ENV === "development" && (
          <div className="mb-6 p-4 rounded-lg bg-[#F1F5F9] text-left">
            <p className="text-xs text-[#64748B] mb-2 font-mono">
              Error: {error.message}
            </p>
            {error.digest && (
              <p className="text-xs text-[#64748B] font-mono">
                ID: {error.digest}
              </p>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            onClick={reset}
            className="bg-[#F97316] hover:bg-[#EA580C] text-white gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Coba Lagi
          </Button>
          <Button
            variant="outline"
            className="border-[#E2E8F0] text-[#334155] gap-2"
            asChild
          >
            <Link href="/">
              <Home className="h-4 w-4" />
              Ke Beranda
            </Link>
          </Button>
        </div>

        {/* Help Text */}
        <div className="mt-8 pt-6 border-t border-[#E2E8F0]">
          <p className="text-sm text-[#64748B]">
            Jika masalah berlanjut, silakan{" "}
            <Link href="/docs" className="text-[#4F46E5] hover:underline">
              lihat dokumentasi
            </Link>{" "}
            atau hubungi support.
          </p>
        </div>
      </div>
    </div>
  );
}

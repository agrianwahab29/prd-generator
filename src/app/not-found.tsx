"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FileText, Home, ArrowLeft } from "lucide-react";

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#EEF2FF] to-white flex items-center justify-center p-4 animate-fade-in">
      <div className="max-w-md w-full text-center animate-slide-up">
        {/* Logo */}
        <Link href="/" className="inline-flex items-center gap-2 mb-8">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#4F46E5] shadow-lg">
            <FileText className="h-6 w-6 text-white" />
          </div>
          <span className="text-2xl font-bold text-[#020617]">
            AI PRD Generator
          </span>
        </Link>

        {/* 404 Illustration */}
        <div className="mb-8">
          <div className="relative">
            <div className="text-[120px] font-bold text-[#4F46E5] leading-none opacity-20">
              404
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-[#EEF2FF] border-4 border-white shadow-xl">
                <FileText className="h-12 w-12 text-[#4F46E5]" />
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <h1 className="text-2xl font-bold text-[#0F172A] mb-3">
          Halaman Tidak Ditemukan
        </h1>
        <p className="text-[#475569] mb-8">
          Maaf, halaman yang Anda cari tidak tersedia. Mungkin telah dipindahkan atau dihapus.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            className="bg-[#4F46E5] hover:bg-[#4338CA] text-white gap-2"
            asChild
          >
            <Link href="/">
              <Home className="h-4 w-4" />
              Ke Beranda
            </Link>
          </Button>
          <Button
            variant="outline"
            className="border-[#E2E8F0] text-[#334155] gap-2"
            onClick={() => window.history.back()}
          >
            <ArrowLeft className="h-4 w-4" />
            Kembali
          </Button>
        </div>

        {/* Help Links */}
        <div className="mt-8 pt-6 border-t border-[#E2E8F0]">
          <p className="text-sm text-[#64748B] mb-3">Butuh bantuan?</p>
          <div className="flex justify-center gap-4 text-sm">
            <Link
              href="/docs"
              className="text-[#4F46E5] hover:underline"
            >
              Dokumentasi
            </Link>
            <span className="text-[#E2E8F0]">|</span>
            <Link
              href="/dashboard"
              className="text-[#4F46E5] hover:underline"
            >
              Dashboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

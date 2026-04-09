import Link from "next/link";
import { FileText, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#EEF2FF] to-white">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-[#E2E8F0] bg-white/80 backdrop-blur-md">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#4F46E5]">
                <FileText className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-[#020617]">
                AI PRD Generator
              </span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto max-w-2xl px-4 py-24 md:px-6 lg:px-8">
        <Card className="border-[#E2E8F0] text-center">
          <CardHeader>
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-[#F8FAFC]">
              <FileText className="h-10 w-10 text-[#64748B]" />
            </div>
            <CardTitle className="text-2xl font-bold text-[#0F172A]">
              PRD Tidak Ditemukan
            </CardTitle>
            <CardDescription className="text-[#64748B]">
              Dokumen PRD yang Anda cari tidak tersedia atau mungkin telah dihapus.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              asChild
              className="bg-[#4F46E5] hover:bg-[#4338CA] text-white"
            >
              <Link href="/">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Kembali ke Beranda
              </Link>
            </Button>
          </CardContent>
        </Card>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#E2E8F0] bg-white py-8">
        <div className="container mx-auto max-w-4xl px-4 md:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-center gap-4">
            <p className="text-sm text-[#64748B]">
              © {new Date().getFullYear()} AI PRD Generator. All rights
              reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

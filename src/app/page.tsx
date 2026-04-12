import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  FileText,
  Zap,
  Globe,
  Download,
  Sparkles,
  ArrowRight,
  Check,
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#EEF2FF] to-white">
      {/* Navigation */}
      <header className="sticky top-0 z-50 w-full border-b border-[#E2E8F0] bg-white/80 backdrop-blur-md">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#4F46E5]">
                <FileText className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-[#020617]">
                AI PRD Generator
              </span>
            </div>
            <nav className="flex items-center gap-4">
              <Link
                href="/login"
                className="text-sm font-medium text-[#475569] transition-colors hover:text-[#4F46E5]"
              >
                Masuk
              </Link>
              <Button
                asChild
                className="bg-[#F97316] hover:bg-[#EA580C] text-white"
              >
                <Link href="/register">Daftar Gratis</Link>
              </Button>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden px-4 py-20 md:py-32">
        <div className="container mx-auto max-w-6xl">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-8 items-center">
            <div className="flex flex-col gap-6 animate-slide-up">
              <Badge className="w-fit bg-[#EEF2FF] text-[#4F46E5] hover:bg-[#E0E7FF]">
                <Sparkles className="mr-1 h-3 w-3" />
                Powered by AI
              </Badge>
              <h1 className="text-4xl font-bold tracking-tight text-[#020617] md:text-5xl lg:text-6xl">
                Buat PRD Profesional dengan{" "}
                <span className="gradient-text">AI</span>
              </h1>
              <p className="text-lg text-[#475569] md:text-xl max-w-lg">
                Dari ide sampai dokumen spesifikasi dalam hitungan menit.
                Mendukung Bahasa Indonesia dan Inggris.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  className="bg-[#F97316] hover:bg-[#EA580C] text-white h-12 px-8"
                  asChild
                >
                  <Link href="/register">
                    Coba Gratis
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="h-12 px-8 border-[#E2E8F0] text-[#334155]"
                  asChild
                >
                  <Link href="#demo">Lihat Demo</Link>
                </Button>
              </div>
              <div className="flex items-center gap-4 text-sm text-[#64748B]">
                <div className="flex items-center gap-1">
                  <Check className="h-4 w-4 text-[#10B981]" />
                  <span>Tanpa kartu kredit</span>
                </div>
                <div className="flex items-center gap-1">
                  <Check className="h-4 w-4 text-[#10B981]" />
                  <span>Free tier tersedia</span>
                </div>
              </div>
            </div>
            <div className="relative animate-slide-up stagger-2">
              <Card className="border-[#E2E8F0] shadow-xl overflow-hidden">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-sm text-[#64748B]">
                      <span className="h-2 w-2 rounded-full bg-[#F97316] animate-pulse"></span>
                      AI sedang menghasilkan PRD...
                    </div>
                    <div className="space-y-2">
                      <div className="h-4 bg-[#E2E8F0] rounded w-3/4"></div>
                      <div className="h-4 bg-[#E2E8F0] rounded w-full"></div>
                      <div className="h-4 bg-[#E2E8F0] rounded w-5/6"></div>
                      <div className="h-4 bg-[#4F46E5] rounded w-1/2 shimmer"></div>
                    </div>
                    <div className="pt-4 border-t border-[#E2E8F0]">
                      <div className="text-xs text-[#64748B] font-mono">
                        # 1. Tujuan Produk<br/>
                        # 2. Fitur Utama<br/>
                        # 3. Target Pengguna
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <div className="absolute -top-4 -right-4 h-24 w-24 bg-gradient-to-br from-[#4F46E5] to-[#F97316] rounded-full opacity-20 blur-2xl"></div>
              <div className="absolute -bottom-4 -left-4 h-32 w-32 bg-[#4F46E5] rounded-full opacity-10 blur-3xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-[#0F172A] mb-4">
              Fitur Unggulan
            </h2>
            <p className="text-lg text-[#475569] max-w-2xl mx-auto">
              Semua yang Anda butuhkan untuk membuat dokumen spesifikasi yang komprehensif
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <div className="animate-slide-up-subtle stagger-1">
              <FeatureCard
                icon={<Zap className="h-6 w-6 text-[#4F46E5]" />}
                title="Generasi Cepat"
                description="Hasilkan PRD lengkap dalam hitungan menit dengan AI yang powerful."
              />
            </div>
            <div className="animate-slide-up-subtle stagger-2">
              <FeatureCard
                icon={<Globe className="h-6 w-6 text-[#4F46E5]" />}
                title="Multibahasa"
                description="Dukungan penuh untuk Bahasa Indonesia dan Inggris."
              />
            </div>
            <div className="animate-slide-up-subtle stagger-3">
              <FeatureCard
                icon={<Download className="h-6 w-6 text-[#4F46E5]" />}
                title="Export PDF"
                description="Unduh PRD dalam format PDF siap presentasi ke stakeholder."
              />
            </div>
            <div className="animate-slide-up-subtle stagger-4">
              <FeatureCard
                icon={<FileText className="h-6 w-6 text-[#4F46E5]" />}
                title="Template Siap Pakai"
                description="Berbagai template PRD untuk berbagai jenis proyek."
              />
            </div>
            <div className="animate-slide-up-subtle stagger-5">
              <FeatureCard
                icon={<Sparkles className="h-6 w-6 text-[#4F46E5]" />}
                title="AI Streaming"
                description="Lihat hasil generasi secara real-time saat AI bekerja."
              />
            </div>
            <div className="animate-slide-up-subtle stagger-6">
              <FeatureCard
                icon={<Check className="h-6 w-6 text-[#4F46E5]" />}
                title="Deployment Ready"
                description="PRD yang dihasilkan siap untuk berbagai platform deployment."
              />
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 bg-[#F8FAFC]">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-[#0F172A] mb-4">
              Cara Kerja
            </h2>
            <p className="text-lg text-[#475569]">
              Tiga langkah sederhana untuk membuat PRD profesional
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            <div className="animate-slide-up-subtle stagger-1">
              <StepCard
                number="1"
                title="Deskripsikan Ide"
                description="Jelaskan konsep aplikasi Anda dalam beberapa kalimat."
              />
            </div>
            <div className="animate-slide-up-subtle stagger-2">
              <StepCard
                number="2"
                title="Pilih Target"
                description="Pilih platform deployment yang Anda inginkan."
              />
            </div>
            <div className="animate-slide-up-subtle stagger-3">
              <StepCard
                number="3"
                title="Dapatkan PRD"
                description="AI akan menghasilkan dokumen spesifikasi lengkap."
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <Card className="border-[#E2E8F0] bg-gradient-to-r from-[#4F46E5] to-[#6366F1]">
            <CardContent className="p-12 text-center">
              <h2 className="text-3xl font-bold text-white mb-4">
                Siap Membuat PRD Pertama Anda?
              </h2>
              <p className="text-lg text-white/80 mb-8 max-w-xl mx-auto">
                Bergabung dengan ribuan developer dan product manager yang menggunakan AI PRD Generator.
              </p>
              <Button
                size="lg"
                className="bg-white text-[#4F46E5] hover:bg-[#F1F5F9] h-12 px-8"
                asChild
              >
                <Link href="/register">
                  Mulai Gratis
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#E2E8F0] bg-white py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#4F46E5]">
                <FileText className="h-4 w-4 text-white" />
              </div>
              <span className="font-semibold text-[#0F172A]">
                AI PRD Generator
              </span>
            </div>
            <p className="text-sm text-[#64748B]">
              © 2024 AI PRD Generator. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <Card className="border-[#E2E8F0] card-hover">
      <CardContent className="p-6">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-[#EEF2FF]">
          {icon}
        </div>
        <h3 className="mb-2 text-lg font-semibold text-[#0F172A]">{title}</h3>
        <p className="text-[#475569]">{description}</p>
      </CardContent>
    </Card>
  );
}

function StepCard({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <div className="text-center">
      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#4F46E5] text-2xl font-bold text-white">
        {number}
      </div>
      <h3 className="mb-2 text-lg font-semibold text-[#0F172A]">{title}</h3>
      <p className="text-[#475569]">{description}</p>
    </div>
  );
}

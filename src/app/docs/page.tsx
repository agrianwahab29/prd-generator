import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  FileText,
  BookOpen,
  ArrowRight,
  Check,
  ChevronRight,
  Key,
  Server,
  Sparkles,
  HelpCircle,
  Lightbulb,
  Shield,
  Clock,
  AlertCircle,
  Zap,
  Target,
  Users,
  Layout,
  MessageSquare,
} from "lucide-react";

export default function DocsPage() {
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
                href="/dashboard"
                className="text-sm font-medium text-[#475569] transition-colors hover:text-[#4F46E5]"
              >
                Dashboard
              </Link>
              <Button
                asChild
                className="bg-[#F97316] hover:bg-[#EA580C] text-white"
              >
                <Link href="/generate">
                  Generate PRD
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden px-4 py-16 md:py-24">
        <div className="container mx-auto max-w-4xl text-center">
          <Badge className="mb-6 bg-[#EEF2FF] text-[#4F46E5] hover:bg-[#E0E7FF]">
            <BookOpen className="mr-1 h-3 w-3" />
            Dokumentasi
          </Badge>
          <h1 className="text-4xl font-bold tracking-tight text-[#020617] md:text-5xl lg:text-6xl mb-6">
            Panduan Pengguna
            <span className="block text-[#4F46E5]">AI PRD Generator</span>
          </h1>
          <p className="text-lg md:text-xl text-[#475569] max-w-2xl mx-auto mb-8">
            Pelajari cara menggunakan AI PRD Generator untuk membuat dokumen spesifikasi produk yang profesional dalam hitungan menit.
          </p>
          <Button
            size="lg"
            className="bg-[#F97316] hover:bg-[#EA580C] text-white h-12 px-8"
            asChild
          >
            <Link href="#cara-penggunaan">
              Mulai Belajar
              <ChevronRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
        <div className="absolute top-20 left-10 h-32 w-32 bg-[#4F46E5] rounded-full opacity-10 blur-3xl"></div>
        <div className="absolute bottom-10 right-10 h-40 w-40 bg-[#F97316] rounded-full opacity-10 blur-3xl"></div>
      </section>

      {/* What is PRD Section */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto max-w-4xl">
          <div className="grid gap-8 lg:grid-cols-2 items-center">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#EEF2FF]">
                  <FileText className="h-5 w-5 text-[#4F46E5]" />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-[#0F172A]">
                  Apa itu PRD?
                </h2>
              </div>
              <p className="text-[#475569] mb-4 leading-relaxed">
                <strong className="text-[#0F172A]">Product Requirements Document (PRD)</strong> adalah dokumen komprehensif yang menjelaskan spesifikasi lengkap sebuah produk software. Dokumen ini menjadi panduan utama bagi tim development, designer, dan stakeholder.
              </p>
              <p className="text-[#475569] mb-4 leading-relaxed">
                PRD yang baik mencakup tujuan produk, fitur-fitur utama, target pengguna, user stories, spesifikasi teknis, dan roadmap pengembangan.
              </p>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-[#475569]">
                  <Check className="h-4 w-4 text-[#10B981]" />
                  <span>Menjadi blueprint untuk tim development</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-[#475569]">
                  <Check className="h-4 w-4 text-[#10B981]" />
                  <span>Memastikan semua stakeholder memiliki visi yang sama</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-[#475569]">
                  <Check className="h-4 w-4 text-[#10B981]" />
                  <span>Mengurangi miskomunikasi dan scope creep</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-[#475569]">
                  <Check className="h-4 w-4 text-[#10B981]" />
                  <span>Mempercepat proses development</span>
                </div>
              </div>
            </div>
            <Card className="border-[#E2E8F0] bg-gradient-to-br from-[#F8FAFC] to-white">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="text-sm font-semibold text-[#4F46E5] uppercase tracking-wide">
                    Struktur PRD yang Baik
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-[#E2E8F0]">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#EEF2FF] text-xs font-medium text-[#4F46E5]">1</span>
                      <span className="text-sm text-[#334155]">Executive Summary</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-[#E2E8F0]">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#EEF2FF] text-xs font-medium text-[#4F46E5]">2</span>
                      <span className="text-sm text-[#334155]">Tujuan & Visi Produk</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-[#E2E8F0]">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#EEF2FF] text-xs font-medium text-[#4F46E5]">3</span>
                      <span className="text-sm text-[#334155]">User Personas & Stories</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-[#E2E8F0]">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#EEF2FF] text-xs font-medium text-[#4F46E5]">4</span>
                      <span className="text-sm text-[#334155]">Fitur & Functional Requirements</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-[#E2E8F0]">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#EEF2FF] text-xs font-medium text-[#4F46E5]">5</span>
                      <span className="text-sm text-[#334155]">Technical Specifications</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-[#E2E8F0]">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#EEF2FF] text-xs font-medium text-[#4F46E5]">6</span>
                      <span className="text-sm text-[#334155]">Timeline & Roadmap</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Separator className="bg-[#E2E8F0]" />

      {/* How to Use Section */}
      <section id="cara-penggunaan" className="py-16 px-4 bg-[#F8FAFC]">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#EEF2FF]">
                <BookOpen className="h-5 w-5 text-[#4F46E5]" />
              </div>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-[#0F172A] mb-4">
              Cara Menggunakan
            </h2>
            <p className="text-[#475569] max-w-2xl mx-auto">
              Ikuti langkah-langkah berikut untuk membuat PRD profesional dengan mudah
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <StepCard
              number="1"
              icon={<Check className="h-5 w-5 text-white" />}
              title="Login atau Register"
              description="Buat akun gratis atau login jika sudah memiliki akun. Hanya butuh email dan password."
            />
            <StepCard
              number="2"
              icon={<Sparkles className="h-5 w-5 text-white" />}
              title="Go to Generate PRD"
              description="Klik menu 'Generate PRD' di dashboard atau navigasi untuk memulai proses pembuatan."
            />
            <StepCard
              number="3"
              icon={<MessageSquare className="h-5 w-5 text-white" />}
              title="Deskripsikan Ide Anda"
              description="Jelaskan konsep aplikasi Anda dengan detail. Semakin spesifik, semakin baik hasilnya."
            />
            <StepCard
              number="4"
              icon={<Server className="h-5 w-5 text-white" />}
              title="Pilih Deployment Target"
              description="Pilih platform tempat aplikasi akan di-deploy (Vercel, Netlify, VPS, atau cPanel)."
            />
            <StepCard
              number="5"
              icon={<Clock className="h-5 w-5 text-white" />}
              title="Generate & Tunggu"
              description="AI akan memproses dan menghasilkan PRD lengkap dalam 1-3 menit. Anda bisa melihat prosesnya real-time."
            />
            <StepCard
              number="6"
              icon={<FileText className="h-5 w-5 text-white" />}
              title="Simpan ke Dashboard"
              description="PRD akan otomatis tersimpan di dashboard Anda untuk diakses kapan saja."
            />
          </div>
        </div>
      </section>

      <Separator className="bg-[#E2E8F0]" />

      {/* Deployment Options Section */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#EEF2FF]">
                <Server className="h-5 w-5 text-[#4F46E5]" />
              </div>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-[#0F172A] mb-4">
              Pilihan Deployment
            </h2>
            <p className="text-[#475569] max-w-2xl mx-auto">
              Pilih platform deployment yang sesuai dengan kebutuhan proyek Anda
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <DeploymentCard
              name="Vercel"
              tagline="Platform Frontend Cloud"
              description="Platform terbaik untuk aplikasi Next.js, React, dan modern frontend frameworks. Menyediakan fitur seperti preview deployments, edge network, dan serverless functions."
              bestFor="Next.js, React, Vue, Svelte"
              color="#000000"
            />
            <DeploymentCard
              name="Netlify"
              tagline="JAMstack Platform"
              description="Platform yang sangat baik untuk static sites, JAMstack applications, dan modern web projects. Fitur form handling, identity, dan edge functions tersedia."
              bestFor="Static Sites, JAMstack, Gatsby"
              color="#00C7B7"
            />
            <DeploymentCard
              name="VPS / Ubuntu"
              tagline="Full Control Server"
              description="Virtual Private Server dengan Ubuntu memberikan kontrol penuh atas konfigurasi server. Ideal untuk aplikasi yang membutuhkan custom setup dan resources dedicated."
              bestFor="Custom Setup, Docker, Full Control"
              color="#E95420"
            />
            <DeploymentCard
              name="cPanel"
              tagline="Traditional Hosting"
              description="Platform hosting tradisional dengan antarmuka cPanel yang familiar. Sangat cocok untuk aplikasi PHP, WordPress, atau proyek yang membutuhkan shared hosting."
              bestFor="PHP, WordPress, Shared Hosting"
              color="#FF6C2C"
            />
          </div>

          <div className="mt-8 p-4 bg-[#FEF3C7] border border-[#F59E0B] rounded-lg">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-[#F59E0B] mt-0.5" />
              <div>
                <p className="text-sm font-medium text-[#92400E]">
                  Tips Memilih Deployment
                </p>
                <p className="text-sm text-[#92400E]/80 mt-1">
                  Pilihan deployment akan mempengaruhi technical specifications dalam PRD yang dihasilkan. Pastikan memilih sesuai dengan kebutuhan teknis dan budget proyek Anda.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Separator className="bg-[#E2E8F0]" />

      {/* API Key Section */}
      <section className="py-16 px-4 bg-[#F8FAFC]">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#EEF2FF]">
                <Key className="h-5 w-5 text-[#4F46E5]" />
              </div>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-[#0F172A] mb-4">
              Mendapatkan API Key
            </h2>
            <p className="text-[#475569] max-w-2xl mx-auto">
              AI PRD Generator membutuhkan API key untuk menghasilkan PRD. Berikut panduan lengkapnya:
            </p>
          </div>

          <div className="space-y-8">
            {/* OpenRouter */}
            <Card className="border-[#E2E8F0]">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#EEF2FF]">
                    <Zap className="h-5 w-5 text-[#4F46E5]" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-[#0F172A]">OpenRouter (Recommended)</h3>
                    <p className="text-sm text-[#475569]">Unified API untuk berbagai AI models</p>
                  </div>
                </div>
                <div className="space-y-3 text-[#475569]">
                  <p className="text-sm leading-relaxed">
                    <strong className="text-[#0F172A]">OpenRouter</strong> adalah platform yang menyediakan akses ke berbagai AI models (Claude, GPT, Llama, dll) dengan satu API key.
                  </p>
                  <ol className="list-decimal list-inside space-y-2 text-sm ml-4">
                    <li>Kunjungi <a href="https://openrouter.ai" target="_blank" rel="noopener noreferrer" className="text-[#4F46E5] hover:underline font-medium">openrouter.ai</a></li>
                    <li>Buat akun gratis dengan email Anda</li>
                    <li>Verifikasi email dan login</li>
                    <li>Pergi ke menu <strong>Keys</strong></li>
                    <li>Klik <strong>Create Key</strong> dan beri nama (misal: &ldquo;PRD Generator&rdquo;)</li>
                    <li>Copy API key yang dihasilkan</li>
                    <li>Paste di halaman <strong>Settings</strong> aplikasi AI PRD Generator</li>
                  </ol>
                </div>
              </CardContent>
            </Card>

            {/* Google AI / Gemini */}
            <Card className="border-[#E2E8F0]">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#EEF2FF]">
                    <Sparkles className="h-5 w-5 text-[#4F46E5]" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-[#0F172A]">Google AI / Gemini (Alternatif)</h3>
                    <p className="text-sm text-[#475569]">API gratis dari Google dengan quota yang besar</p>
                  </div>
                </div>
                <div className="space-y-3 text-[#475569]">
                  <p className="text-sm leading-relaxed">
                    <strong className="text-[#0F172A]">Google AI Studio</strong> menyediakan akses gratis ke Gemini models dengan free tier yang sangat besar (60 requests per minute).
                  </p>
                  <ol className="list-decimal list-inside space-y-2 text-sm ml-4">
                    <li>Kunjungi <a href="https://aistudio.google.com" target="_blank" rel="noopener noreferrer" className="text-[#4F46E5] hover:underline font-medium">aistudio.google.com</a></li>
                    <li>Login dengan akun Google Anda</li>
                    <li>Klik menu <strong>Get API Key</strong></li>
                    <li>Buat API key baru</li>
                    <li>Copy dan paste di halaman <strong>Settings</strong></li>
                  </ol>
                </div>
              </CardContent>
            </Card>

            {/* Saving API Key */}
            <Card className="border-[#E2E8F0] bg-gradient-to-r from-[#EEF2FF] to-white">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#4F46E5]">
                    <Shield className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-[#0F172A]">Menyimpan API Key</h3>
                    <p className="text-sm text-[#475569]">Keamanan data Anda adalah prioritas kami</p>
                  </div>
                </div>
                <div className="space-y-3 text-[#475569]">
                  <ol className="list-decimal list-inside space-y-2 text-sm ml-4">
                    <li>Login ke aplikasi AI PRD Generator</li>
                    <li>Klik menu <strong>Settings</strong> di sidebar atau navigasi</li>
                    <li>Masukkan API key di field yang tersedia</li>
                    <li>Klik <strong>Save</strong> untuk menyimpan</li>
                    <li>API key akan dienkripsi dan disimpan dengan aman</li>
                  </ol>
                  <div className="mt-4 p-3 bg-[#FEF2F2] border border-[#FECACA] rounded-lg">
                    <p className="text-xs text-[#991B1B]">
                      <strong>Penting:</strong> API key Anda dienkripsi sebelum disimpan di database. Kami tidak pernah menyimpan API key dalam bentuk plain text.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Separator className="bg-[#E2E8F0]" />

      {/* FAQ Section */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#EEF2FF]">
                <HelpCircle className="h-5 w-5 text-[#4F46E5]" />
              </div>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-[#0F172A] mb-4">
              Pertanyaan Umum (FAQ)
            </h2>
            <p className="text-[#475569] max-w-2xl mx-auto">
              Jawaban untuk pertanyaan yang sering ditanyakan
            </p>
          </div>

          <div className="space-y-4">
            <FAQItem
              question="Apakah data saya aman?"
              answer="Ya, keamanan data adalah prioritas utama kami. API key Anda dienkripsi menggunakan algoritma enkripsi yang kuat sebelum disimpan. Kami tidak pernah menyimpan API key dalam bentuk plain text. Selain itu, semua data PRD Anda hanya dapat diakses oleh akun Anda sendiri."
            />
            <FAQItem
              question="Berapa lama PRD dihasilkan?"
              answer="Biasanya PRD dihasilkan dalam waktu 1-3 menit tergantung pada kompleksitas aplikasi yang dideskripsikan. Proses generasi dilakukan secara real-time dan Anda bisa melihat progressnya saat AI sedang bekerja."
            />
            <FAQItem
              question="Bisakah saya edit PRD setelah dihasilkan?"
              answer="Ya, Anda bisa mengedit PRD yang sudah dihasilkan. Klik tombol Edit di dashboard untuk membuka editor PRD. Anda bisa melakukan perubahan, regenerasi bagian tertentu, atau menambahkan informasi tambahan."
            />
            <FAQItem
              question="Bagaimana cara export ke PDF?"
              answer="Setelah PRD dihasilkan, klik tombol 'Export PDF' di halaman detail PRD atau di dashboard. Dokumen PDF akan diunduh ke komputer Anda dengan format yang rapi dan siap untuk dipresentasikan."
            />
            <FAQItem
              question="Apakah ada limit penggunaan?"
              answer="Limit penggunaan tergantung pada provider AI yang Anda gunakan. Jika menggunakan Google AI/Gemini, Anda mendapatkan 60 requests per menit secara gratis. OpenRouter memiliki model gratis dan berbayar dengan pricing yang bervariasi. Anda bisa memonitor penggunaan di dashboard Settings."
            />
            <FAQItem
              question="Bahasa apa saja yang didukung?"
              answer="AI PRD Generator mendukung berbagai bahasa termasuk Bahasa Indonesia dan Inggris. Anda bisa meminta PRD dalam bahasa tertentu saat mendeskripsikan ide aplikasi Anda."
            />
            <FAQItem
              question="Apakah saya perlu kartu kredit?"
              answer="Tidak untuk memulai. Anda bisa menggunakan Google AI/Gemini yang menyediakan tier gratis yang sangat besar. Untuk OpenRouter, ada model-model gratis yang tersedia. Kartu kredit hanya diperlukan jika Anda ingin menggunakan model berbayar dengan fitur lebih advanced."
            />
          </div>
        </div>
      </section>

      <Separator className="bg-[#E2E8F0]" />

      {/* Tips Section */}
      <section className="py-16 px-4 bg-[#F8FAFC]">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#EEF2FF]">
                <Lightbulb className="h-5 w-5 text-[#4F46E5]" />
              </div>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-[#0F172A] mb-4">
              Tips Menulis Prompt yang Baik
            </h2>
            <p className="text-[#475569] max-w-2xl mx-auto">
              Semakin baik prompt Anda, semakin berkualitas PRD yang dihasilkan
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <TipCard
              icon={<Target className="h-6 w-6 text-[#4F46E5]" />}
              title="Jelaskan Masalah yang Diselesaikan"
              description="Deskripsikan masalah spesifik yang akan dipecahkan oleh aplikasi Anda. Contoh: 'Aplikasi ini membantu UMKM mengelola inventory secara real-time dengan barcode scanning.'"
            />
            <TipCard
              icon={<Layout className="h-6 w-6 text-[#4F46E5]" />}
              title="Sebutkan Fitur Utama"
              description="List fitur-fitur penting yang harus ada. Contoh: 'Fitur utama: dashboard analytics, notifikasi otomatis, multi-user support dengan role-based access.'"
            />
            <TipCard
              icon={<Users className="h-6 w-6 text-[#4F46E5]" />}
              title="Tentukan Target Pengguna"
              description="Jelaskan siapa yang akan menggunakan aplikasi ini. Contoh: 'Target pengguna: manager restoran, staff dapur, dan owner yang ingin memantau operasional via mobile.'"
            />
            <TipCard
              icon={<Server className="h-6 w-6 text-[#4F46E5]" />}
              title="Sebutkan Platform & Bahasa"
              description="Tentukan tech stack yang diinginkan. Contoh: 'Aplikasi web-based menggunakan Next.js 14, TypeScript, Tailwind CSS, dengan backend Supabase PostgreSQL.'"
            />
          </div>

          <Card className="mt-8 border-[#F97316]/30 bg-[#FFF7ED]">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#F97316]">
                  <Sparkles className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-[#0F172A] mb-2">
                    Contoh Prompt yang Optimal
                  </h3>
                  <p className="text-sm text-[#475569] mb-3">
                    Berikut contoh prompt yang akan menghasilkan PRD berkualitas tinggi:
                  </p>
                  <div className="p-4 bg-white rounded-lg border border-[#FDBA74] text-sm text-[#334155] leading-relaxed">
                    &ldquo;Buatkan PRD untuk aplikasi manajemen tugas (task management) untuk tim remote. Masalah yang diselesaikan: tim sulit tracking progress dan deadline project. Fitur utama: kanban board, time tracking, file attachment, comment system, email notifications, dan weekly report otomatis. Target pengguna: project manager, developer, designer remote. Platform: web app dengan Next.js, real-time update dengan WebSocket, deploy ke Vercel. Butuh integrasi dengan Slack dan Google Calendar.&rdquo;
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#E2E8F0] bg-white py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid gap-8 md:grid-cols-3 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#4F46E5]">
                  <FileText className="h-4 w-4 text-white" />
                </div>
                <span className="font-semibold text-[#0F172A]">
                  AI PRD Generator
                </span>
              </div>
              <p className="text-sm text-[#64748B]">
                Membuat Product Requirements Document profesional dengan bantuan AI dalam hitungan menit.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-[#0F172A] mb-4">Navigasi</h4>
              <ul className="space-y-2 text-sm text-[#64748B]">
                <li>
                  <Link href="/dashboard" className="hover:text-[#4F46E5] transition-colors">
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link href="/generate" className="hover:text-[#4F46E5] transition-colors">
                    Generate PRD
                  </Link>
                </li>
                <li>
                  <Link href="/settings" className="hover:text-[#4F46E5] transition-colors">
                    Settings
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-[#0F172A] mb-4">Bantuan</h4>
              <ul className="space-y-2 text-sm text-[#64748B]">
                <li>
                  <Link href="/docs" className="hover:text-[#4F46E5] transition-colors">
                    Dokumentasi
                  </Link>
                </li>
                <li>
                  <a href="mailto:support@aiprdgenerator.com" className="hover:text-[#4F46E5] transition-colors">
                    Contact Support
                  </a>
                </li>
                <li>
                  <Link href="/faq" className="hover:text-[#4F46E5] transition-colors">
                    FAQ
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <Separator className="bg-[#E2E8F0] mb-8" />
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-[#64748B]">
              © 2024 AI PRD Generator. All rights reserved.
            </p>
            <Button variant="outline" size="sm" className="border-[#E2E8F0]" asChild>
              <Link href="/dashboard">
                Kembali ke Dashboard
              </Link>
            </Button>
          </div>
        </div>
      </footer>
    </div>
  );
}

function StepCard({
  number,
  icon,
  title,
  description,
}: {
  number: string;
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <Card className="border-[#E2E8F0] hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
      <CardContent className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#4F46E5]">
            {icon}
          </div>
          <span className="text-sm font-semibold text-[#4F46E5]">Step {number}</span>
        </div>
        <h3 className="text-lg font-semibold text-[#0F172A] mb-2">{title}</h3>
        <p className="text-sm text-[#475569] leading-relaxed">{description}</p>
      </CardContent>
    </Card>
  );
}

function DeploymentCard({
  name,
  tagline,
  description,
  bestFor,
  color,
}: {
  name: string;
  tagline: string;
  description: string;
  bestFor: string;
  color: string;
}) {
  return (
    <Card className="border-[#E2E8F0] hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
      <CardContent className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <div 
            className="flex h-12 w-12 items-center justify-center rounded-lg text-white font-bold text-lg"
            style={{ backgroundColor: color }}
          >
            {name.charAt(0)}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-[#0F172A]">{name}</h3>
            <p className="text-xs text-[#64748B]">{tagline}</p>
          </div>
        </div>
        <p className="text-sm text-[#475569] mb-4 leading-relaxed">{description}</p>
        <div className="pt-4 border-t border-[#E2E8F0]">
          <p className="text-xs text-[#64748B]">
            <span className="font-medium text-[#4F46E5]">Best for:</span> {bestFor}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

function FAQItem({
  question,
  answer,
}: {
  question: string;
  answer: string;
}) {
  return (
    <Card className="border-[#E2E8F0]">
      <CardContent className="p-6">
        <div className="flex items-start gap-3">
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#EEF2FF] mt-0.5">
            <HelpCircle className="h-3 w-3 text-[#4F46E5]" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-[#0F172A] mb-2">{question}</h3>
            <p className="text-sm text-[#475569] leading-relaxed">{answer}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function TipCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <Card className="border-[#E2E8F0] hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
      <CardContent className="p-6">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-[#EEF2FF]">
          {icon}
        </div>
        <h3 className="mb-2 text-lg font-semibold text-[#0F172A]">{title}</h3>
        <p className="text-sm text-[#475569] leading-relaxed">{description}</p>
      </CardContent>
    </Card>
  );
}

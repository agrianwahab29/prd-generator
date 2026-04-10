import { Metadata } from "next";
import Link from "next/link";
import { FileText, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Syarat dan Ketentuan - AI PRD Generator",
  description: "Syarat dan ketentuan penggunaan layanan AI PRD Generator",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#EEF2FF] to-white">
      {/* Header */}
      <header className="border-b border-[#E2E8F0] bg-white/80 backdrop-blur-sm">
        <div className="mx-auto max-w-4xl px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="inline-flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#4F46E5] shadow-lg">
                <FileText className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-[#020617]">
                AI PRD Generator
              </span>
            </Link>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Kembali
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="mx-auto max-w-4xl px-4 py-12">
        <Card className="border-[#E2E8F0] shadow-lg">
          <CardHeader className="border-b border-[#E2E8F0] pb-6">
            <CardTitle className="text-3xl font-bold text-[#0F172A]">
              Syarat dan Ketentuan
            </CardTitle>
            <p className="text-[#64748B] mt-2">
              Terakhir diperbarui: {new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </CardHeader>
          <CardContent className="space-y-8 py-8">
            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-[#0F172A]">1. Penerimaan Syarat</h2>
              <p className="text-[#475569] leading-relaxed">
                Dengan mengakses atau menggunakan AI PRD Generator, Anda setuju untuk terikat oleh 
                syarat dan ketentuan ini. Jika Anda tidak setuju dengan bagian mana pun dari syarat ini, 
                Anda tidak boleh menggunakan layanan kami.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-[#0F172A]">2. Deskripsi Layanan</h2>
              <p className="text-[#475569] leading-relaxed">
                AI PRD Generator adalah platform yang menggunakan kecerdasan buatan untuk membantu 
                pengguna membuat dokumen Product Requirements Document (PRD) berdasarkan deskripsi 
                aplikasi yang diberikan. Layanan ini tersedia dalam versi gratis dan berbayar.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-[#0F172A]">3. Akun Pengguna</h2>
              <p className="text-[#475569] leading-relaxed">
                Untuk menggunakan fitur tertentu, Anda harus membuat akun. Anda bertanggung jawab untuk:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-[#475569]">
                <li>Menjaga kerahasiaan informasi login Anda</li>
                <li>Memastikan data yang Anda berikan akurat dan terkini</li>
                <li>Bertanggung jawab atas semua aktivitas yang terjadi di bawah akun Anda</li>
                <li>Segera memberitahu kami jika ada penggunaan tidak sah atas akun Anda</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-[#0F172A]">4. Penggunaan yang Dilarang</h2>
              <p className="text-[#475569] leading-relaxed">
                Anda setuju untuk tidak menggunakan layanan ini untuk:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-[#475569]">
                <li>Melanggar hukum atau peraturan yang berlaku</li>
                <li>Mengirimkan konten yang melanggar hak kekayaan intelektual pihak ketiga</li>
                <li>Menyebarluaskan konten yang berbahaya, menipu, atau mengandung malware</li>
                <li>Mencoba mengakses sistem atau data pengguna lain tanpa izin</li>
                <li>Mengganggu atau merusak operasi layanan kami</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-[#0F172A]">5. Konten dan Hak Cipta</h2>
              <p className="text-[#475569] leading-relaxed">
                Anda mempertahankan hak atas konten yang Anda buat menggunakan layanan kami. 
                Namun, Anda memberikan kami lisensi terbatas untuk menggunakan, menyimpan, dan 
                memproses konten tersebut semata-mata untuk tujuan menyediakan layanan.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-[#0F172A]">6. Pembatasan Tanggung Jawab</h2>
              <p className="text-[#475569] leading-relaxed">
                AI PRD Generator disediakan &quot;sebagaimana adanya&quot; tanpa jaminan apa pun. 
                Kami tidak menjamin bahwa layanan akan selalu tersedia, bebas kesalahan, atau 
                memenuhi kebutuhan spesifik Anda. Penggunaan layanan ini sepenuhnya adalah risiko Anda sendiri.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-[#0F172A]">7. Perubahan Syarat</h2>
              <p className="text-[#475569] leading-relaxed">
                Kami berhak mengubah syarat dan ketentuan ini kapan saja. Perubahan akan efektif 
                segera setelah diposting di situs. Penggunaan berkelanjutan atas layanan kami 
                setelah perubahan berarti Anda menerima syarat yang diperbarui.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-[#0F172A]">8. Penghentian</h2>
              <p className="text-[#475569] leading-relaxed">
                Kami berhak menangguhkan atau menghentikan akses Anda ke layanan kapan saja, 
                dengan atau tanpa pemberitahuan, karena alasan apa pun termasuk pelanggaran terhadap syarat ini.
              </p>
            </section>

            <section className="space-y-3 pt-4 border-t border-[#E2E8F0]">
              <h2 className="text-xl font-semibold text-[#0F172A]">Kontak</h2>
              <p className="text-[#475569] leading-relaxed">
                Jika Anda memiliki pertanyaan tentang syarat dan ketentuan ini, silakan hubungi kami di:{" "}
                <a href="mailto:support@prdgenerator.com" className="text-[#4F46E5] hover:underline">
                  support@prdgenerator.com
                </a>
              </p>
            </section>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

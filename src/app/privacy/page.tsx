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
  title: "Kebijakan Privasi - AI PRD Generator",
  description: "Kebijakan privasi dan perlindungan data pengguna AI PRD Generator",
};

export default function PrivacyPage() {
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
              Kebijakan Privasi
            </CardTitle>
            <p className="text-[#64748B] mt-2">
              Terakhir diperbarui: {new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </CardHeader>
          <CardContent className="space-y-8 py-8">
            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-[#0F172A]">1. Informasi yang Kami Kumpulkan</h2>
              <p className="text-[#475569] leading-relaxed">
                Kami mengumpulkan informasi yang Anda berikan secara langsung saat menggunakan layanan kami, 
                termasuk nama, alamat email, dan informasi akun. Kami juga mengumpulkan data teknis seperti 
                alamat IP, jenis browser, dan informasi perangkat untuk meningkatkan pengalaman pengguna.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-[#0F172A]">2. Penggunaan Informasi</h2>
              <p className="text-[#475569] leading-relaxed">
                Informasi yang kami kumpulkan digunakan untuk:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-[#475569]">
                <li>Menyediakan dan meningkatkan layanan AI PRD Generator</li>
                <li>Mengautentikasi pengguna dan mengamankan akun</li>
                <li>Mengirimkan notifikasi penting terkait layanan</li>
                <li>Menganalisis penggunaan untuk pengembangan produk</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-[#0F172A]">3. Perlindungan Data</h2>
              <p className="text-[#475569] leading-relaxed">
                Kami menggunakan teknologi enkripsi dan protokol keamanan yang sesuai untuk melindungi 
                data pribadi Anda. Semua data disimpan di server yang aman dan hanya dapat diakses oleh 
                personel yang berwenang.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-[#0F172A]">4. Berbagi Informasi</h2>
              <p className="text-[#475569] leading-relaxed">
                Kami tidak menjual atau menyewakan data pribadi Anda kepada pihak ketiga. 
                Informasi hanya dibagikan dalam kasus-kasus berikut:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-[#475569]">
                <li>Dengan persetujuan eksplisit dari Anda</li>
                <li>Untuk mematuhi kewajiban hukum atau permintaan pemerintah</li>
                <li>Untuk melindungi hak, properti, atau keselamatan kami dan pengguna lain</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-[#0F172A]">5. Hak Pengguna</h2>
              <p className="text-[#475569] leading-relaxed">
                Anda memiliki hak untuk mengakses, memperbarui, atau menghapus data pribadi Anda. 
                Hubungi kami melalui email untuk permintaan terkait data pribadi Anda.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-[#0F172A]">6. Perubahan Kebijakan</h2>
              <p className="text-[#475569] leading-relaxed">
                Kami dapat memperbarui kebijakan privasi ini dari waktu ke waktu. 
                Perubahan akan diumumkan melalui aplikasi atau email. 
                Penggunaan berkelanjutan atas layanan kami setelah perubahan berarti Anda menerima kebijakan yang diperbarui.
              </p>
            </section>

            <section className="space-y-3 pt-4 border-t border-[#E2E8F0]">
              <h2 className="text-xl font-semibold text-[#0F172A]">Kontak</h2>
              <p className="text-[#475569] leading-relaxed">
                Jika Anda memiliki pertanyaan tentang kebijakan privasi ini, silakan hubungi kami di:{" "}
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

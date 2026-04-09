🚀 PRD Finishing – Deployment & Polish
Versi	1.0
Terkait	Sistem Pembuat Task & PRD
Fokus	Deployment, Optimasi, Testing, Fitur Tambahan
1. Deployment ke Vercel
1.1. Environment Variables (Vercel Dashboard)
text
# Database
DATABASE_URL=postgresql://postgres.[PROJECT_REF]:[PASSWORD]@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres
DIRECT_URL=postgresql://postgres.[PROJECT_REF]:[PASSWORD]@db.[PROJECT_REF].supabase.co:5432/postgres

# Better Auth
BETTER_AUTH_SECRET=[random-32-byte-base64]
BETTER_AUTH_URL=https://yourdomain.vercel.app

# OAuth
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
GITHUB_CLIENT_ID=...
GITHUB_CLIENT_SECRET=...

# AI Provider (Admin Key)
OPENROUTER_API_KEY=sk-or-v1-...

# Enkripsi
ENCRYPTION_KEY=[random-32-byte-base64]

# App
NEXT_PUBLIC_APP_URL=https://yourdomain.vercel.app
1.2. Domain Kustom (Opsional)
Tambahkan domain di Vercel, atur DNS.

Update BETTER_AUTH_URL dan NEXT_PUBLIC_APP_URL.

1.3. Supabase Setup
Buat proyek baru.

Jalankan migration untuk tabel kustom (projects, user_settings).

Aktifkan Row Level Security (policy sederhana: user hanya bisa akses data miliknya, atau matikan jika semua akses via server).

Jika ingin menggunakan storage untuk PDF, buat bucket prd-pdfs dengan policy private.

2. Optimasi & Performa
Next.js Bundle Analysis: Gunakan @next/bundle-analyzer untuk memantau ukuran bundle.

Image Optimization: Gunakan next/image untuk logo/avatar.

Font Optimization: Gunakan next/font untuk Google Fonts.

Caching: Manfaatkan unstable_cache atau cache dari React untuk fetch data di RSC (misal daftar proyek).

3. Testing
3.1. Unit & Integration Test
Vitest untuk unit test fungsi enkripsi, parsing prompt.

React Testing Library untuk komponen form.

Supertest atau fetch mock untuk test endpoint API.

3.2. End-to-End (E2E)
Playwright untuk skenario:

Registrasi user baru.
Login.
Generate PRD (mock respons AI untuk kecepatan).
Simpan proyek.
Hapus proyek.
Ubah API key.
4. Fitur Tambahan (Post-MVP)
Export PDF: Gunakan library seperti @react-pdf/renderer di server action untuk generate PDF dari markdown.

Share Public Link: Buat halaman publik /p/[id] dengan tampilan read-only yang bisa dibagikan.

Template Prompt: Berikan beberapa template prompt untuk memudahkan pengguna baru.

Realtime Collaboration: (Opsional) Menggunakan Supabase Realtime untuk melihat perubahan jika ada tim.

5. Monitoring & Error Tracking
Sentry: Integrasi dengan Next.js untuk menangkap error client dan server.

Vercel Analytics: Untuk memantau performa halaman dan traffic.

Logging: Gunakan console.error untuk error kritis, bisa diarahkan ke service seperti Logtail.

6. Dokumentasi Pengguna
Buat halaman /docs sederhana yang menjelaskan:

Cara menggunakan generator.

Perbedaan pilihan deployment.

Cara mendapatkan API key dari OpenRouter / Gemini.

FAQ tentang keamanan data.

7. Checklist Go-Live
Environment variables Vercel sudah diisi semua.

Supabase connection pooler berfungsi (uji dengan npm run db:push).

OAuth callback URL di Google Cloud Console dan GitHub OAuth Apps sudah diupdate ke domain produksi.

Testing alur lengkap dari registrasi hingga generate PRD.

Rate limiting diaktifkan (misal via Vercel WAF atau package upstash/ratelimit).

Halaman error kustom (404, 500) sudah dibuat.

robots.txt dan sitemap.xml (jika diperlukan).
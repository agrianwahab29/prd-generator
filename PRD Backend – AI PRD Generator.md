⚙️ PRD Backend – AI PRD Generator
Versi	1.0
Terkait	Sistem Pembuat Task & PRD
Stack	Next.js API Routes, Better Auth, Drizzle ORM, Vercel AI SDK
1. Tujuan Backend
Menyediakan API yang aman untuk autentikasi pengguna.

Mengelola koneksi ke database Supabase.

Menangani logika pemilihan API key AI (admin default vs user custom).

Menyediakan endpoint streaming /api/generate untuk menghasilkan PRD.

Melindungi data pengguna dengan Row Level Security (RLS) dan enkripsi.

2. Autentikasi & Otorisasi (Better Auth)
2.1. Konfigurasi Lengkap
Adapter Database: drizzleAdapter dengan schema Drizzle yang sudah sinkron dengan Supabase.

Social Providers: Google dan GitHub (environment variables wajib).

Session Management: Cookie-based, secure, httpOnly.

2.2. Middleware Global
File middleware.ts menggunakan auth middleware dari Better Auth.

Proteksi rute API: /api/generate, /api/projects/* hanya dapat diakses dengan session valid.

Proteksi rute halaman: /dashboard/* redirect ke login jika tidak ada session.

2.3. Integrasi dengan Supabase RLS
Karena Better Auth menyimpan user di tabel user di schema public, kita bisa memanfaatkan fungsi auth.uid() bawaan Supabase dengan sedikit penyesuaian. Atau lebih sederhana: semua query database dilakukan di server-side dengan pengecekan user_id manual (kita tidak perlu RLS jika semua akses melalui API server yang sudah terautentikasi). Namun untuk keamanan berlapis, tetap aktifkan RLS.

3. Skema Database (Drizzle ORM)
typescript
// db/schema.ts
import { pgTable, uuid, text, timestamp } from "drizzle-orm/pg-core";

// Tabel Better Auth akan dibuat otomatis oleh adapter, kita tidak perlu definisi manual.
// Tapi kita definisikan tabel kustom kita:

export const projects = pgTable("projects", {
  id: uuid("id").primaryKey().defaultRandom(),
  user_id: uuid("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  prompt: text("prompt").notNull(),
  deployment_target: text("deployment_target").notNull(),
  generated_prd: text("generated_prd").notNull(),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

export const user_settings = pgTable("user_settings", {
  user_id: uuid("user_id").primaryKey().references(() => user.id, { onDelete: "cascade" }),
  api_key_encrypted: text("api_key_encrypted"),
  api_provider: text("api_provider").default("openrouter"),
  updated_at: timestamp("updated_at").defaultNow(),
});

// Import tabel user dari better-auth (jika perlu relasi)
import { user } from "@/lib/auth/db-schema"; // path ke schema Better Auth
4. Endpoint API: /api/generate
4.1. Logika Backend
Verifikasi session (opsional untuk user tidak login, tapi fitur simpan hanya untuk login).

Ambil payload prompt dan deployment.

Tentukan AI client:

Jika user login dan memiliki api_key_encrypted di user_settings, decrypt dan gunakan.

Jika tidak, gunakan OPENROUTER_API_KEY dari environment.

Bangun system prompt yang mencakup target deployment.

Gunakan streamText dari Vercel AI SDK dengan model yang sesuai (misal openai/gpt-4o via OpenRouter).

Pada callback onFinish, jika user login, simpan hasil ke database.

Return DataStreamResponse.

4.2. Keamanan Enkripsi API Key User
Gunakan secret key ENCRYPTION_KEY (32 byte, base64) dari environment.

Fungsi encrypt/decrypt menggunakan AES-256-GCM (sudah dicontohkan di PRD sebelumnya).

4.3. Penanganan Error
Jika API key user tidak valid (misal return 401 dari provider), tangkap error dan kirim respons yang ramah: "API key Anda tidak valid atau telah mencapai batas kuota. Silakan periksa kembali di Pengaturan."

5. Server Actions untuk Mutasi Data
Untuk keamanan dan kemudahan, gunakan Server Actions untuk:

saveProject (simpan PRD)

deleteProject

updateSettings (simpan API key terenkripsi)

Contoh action updateSettings:

typescript
// app/actions/settings.ts
"use server";

import { auth } from "@/lib/auth";
import { db } from "@/db";
import { user_settings } from "@/db/schema";
import { encrypt } from "@/lib/crypto";
import { revalidatePath } from "next/cache";

export async function updateApiKey(formData: FormData) {
  const session = await auth.api.getSession();
  if (!session) throw new Error("Unauthorized");

  const apiKey = formData.get("apiKey") as string;
  const provider = formData.get("provider") as string;

  const encrypted = encrypt(apiKey);

  await db
    .insert(user_settings)
    .values({
      user_id: session.user.id,
      api_key_encrypted: encrypted,
      api_provider: provider,
    })
    .onConflictDoUpdate({
      target: user_settings.user_id,
      set: {
        api_key_encrypted: encrypted,
        api_provider: provider,
        updated_at: new Date(),
      },
    });

  revalidatePath("/dashboard/settings");
}
6. Koneksi Database untuk Serverless (Vercel)
Gunakan Postgres.js dengan konfigurasi connection pooler Supabase (DATABASE_URL dengan port 6543).

Set max: 1 untuk mencegah idle connection di serverless.

Gunakan prepare: false untuk menghindari prepared statement caching.

typescript
// db/index.ts
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const connectionString = process.env.DATABASE_URL!;
const client = postgres(connectionString, { max: 1, prepare: false });
export const db = drizzle(client, { schema });
7. Integrasi dengan Vercel AI SDK
Install @ai-sdk/openai dan ai.

Untuk OpenRouter, gunakan baseURL custom: https://openrouter.ai/api/v1.

Sertakan header HTTP-Referer dan X-Title sesuai ketentuan OpenRouter.

typescript
const openrouter = createOpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: apiKey,
  headers: {
    "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL,
    "X-Title": "AI PRD Generator",
  },
});
📱 PRD Frontend – AI PRD Generator
Versi	1.0
Terkait	Sistem Pembuat Task & PRD
Target	Next.js 15 + React 19 + Tailwind + shadcn/ui
1. Tujuan Frontend
Menyediakan antarmuka yang intuitif bagi pengguna untuk:

Melakukan autentikasi (login/register) dengan berbagai metode.

Memasukkan ide proyek (prompt) dan memilih target deployment.

Melihat hasil PRD yang dihasilkan AI secara real-time streaming.

Mengelola proyek yang telah disimpan (dashboard).

Mengelola pengaturan akun (termasuk API key pribadi).

2. Arsitektur Halaman (Routing App Router)
Rute	Komponen Utama	Keterangan
/	LandingPage	Halaman publik dengan penjelasan produk dan ajakan login. Bisa juga langsung berisi form generator untuk user tidak login (opsional).
/login	LoginForm	Form email/password + tombol OAuth (Google/GitHub).
/register	RegisterForm	Form pendaftaran.
/dashboard	ProjectList	Daftar proyek yang pernah dibuat, dengan tombol "Buat Baru".
/dashboard/generate	GenerateForm + ResultView	Halaman utama pembuatan PRD (streaming).
/dashboard/projects/[id]	ProjectDetail	Menampilkan PRD yang sudah disimpan (read-only, dengan opsi download/copy).
/dashboard/settings	SettingsForm	Mengelola API key pribadi, preferensi provider.
3. Komponen UI (shadcn/ui yang Digunakan)
Form Elements: Input, Textarea, Select, Button, Label, Form (react-hook-form terintegrasi).

Layout: Card, Separator, Tabs.

Feedback: Toast (sonner), Alert, Skeleton (loading state).

Typography: Markdown renderer (menggunakan react-markdown + remark-gfm).

Auth: SignIn / SignUp card custom dengan styling shadcn.

4. State Management & Alur Data
4.1. Client State (React Hooks)
Form State: react-hook-form + zod untuk validasi input prompt (minimal 10 karakter).

Streaming State: Custom hook useStreamingResponse untuk mengelola potongan teks dari API.

4.2. Server State (Data Fetching)
Menggunakan React Server Components (RSC) untuk halaman dashboard (fetch data proyek langsung di server).

Mutasi data (simpan, hapus) menggunakan Server Actions (Next.js 15) untuk keamanan dan kesederhanaan.

4.3. Autentikasi Context
Menggunakan helper dari Better Auth: auth-client untuk mendapatkan session di client component.

Middleware Next.js sudah menangani redirect, jadi client hanya perlu membaca status login.

5. Halaman Kritis: Generator dengan Streaming
5.1. Komponen GenerateForm
tsx
// app/dashboard/generate/page.tsx (Client Component)
"use client";

import { useStreaming } from "@/hooks/use-streaming";
import { MarkdownRenderer } from "@/components/markdown-renderer";

export default function GeneratePage() {
  const { content, isStreaming, error, startGeneration } = useStreaming();

  const onSubmit = async (data: FormData) => {
    await startGeneration({
      prompt: data.prompt,
      deployment: data.deployment,
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>Deskripsikan Proyek Anda</CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="prompt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ide / Konsep Aplikasi</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Contoh: Sistem kasir online dengan QRIS..." rows={6} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="deployment"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Target Deployment</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih environment" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="vercel">Vercel</SelectItem>
                        <SelectItem value="netlify">Netlify</SelectItem>
                        <SelectItem value="vps">VPS (Ubuntu)</SelectItem>
                        <SelectItem value="cpanel">cPanel</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isStreaming}>
                {isStreaming ? "Menghasilkan..." : "Generate PRD"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>Hasil PRD</CardHeader>
        <CardContent>
          {isStreaming && !content && <Skeleton className="h-64" />}
          {content && <MarkdownRenderer content={content} />}
          {error && <Alert variant="destructive">{error}</Alert>}
          {!isStreaming && content && (
            <div className="flex gap-2 mt-4">
              <Button variant="outline" onClick={handleCopy}>Copy Markdown</Button>
              <Button variant="outline" onClick={handleDownloadPDF}>Download PDF</Button>
              <Button onClick={handleSave}>Simpan ke Dashboard</Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
5.2. Custom Hook useStreaming
typescript
// hooks/use-streaming.ts
import { useState } from "react";

export function useStreaming() {
  const [content, setContent] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startGeneration = async (payload: { prompt: string; deployment: string }) => {
    setIsStreaming(true);
    setContent("");
    setError(null);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Gagal memulai generasi");

      const reader = response.body?.getReader();
      if (!reader) throw new Error("Stream tidak tersedia");

      const decoder = new TextDecoder();
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value);
        setContent((prev) => prev + chunk);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan");
    } finally {
      setIsStreaming(false);
    }
  };

  return { content, isStreaming, error, startGeneration };
}
6. Dashboard & Manajemen Proyek
Server Component untuk fetch daftar proyek:

tsx
// app/dashboard/page.tsx
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { projects } from "@/db/schema";
import { eq } from "drizzle-orm";
import { ProjectCard } from "./project-card";

export default async function DashboardPage() {
  const session = await auth.api.getSession();
  if (!session) redirect("/login");

  const userProjects = await db.query.projects.findMany({
    where: eq(projects.user_id, session.user.id),
    orderBy: (projects, { desc }) => [desc(projects.created_at)],
  });

  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Proyek Saya</h1>
        <Button asChild>
          <Link href="/dashboard/generate">+ Buat PRD Baru</Link>
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {userProjects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </div>
  );
}
Server Action untuk simpan/hapus proyek:

typescript
// app/actions/projects.ts
"use server";

import { auth } from "@/lib/auth";
import { db } from "@/db";
import { projects } from "@/db/schema";
import { revalidatePath } from "next/cache";

export async function saveProject(data: {
  title: string;
  prompt: string;
  deployment: string;
  prdContent: string;
}) {
  const session = await auth.api.getSession();
  if (!session) throw new Error("Unauthorized");

  await db.insert(projects).values({
    user_id: session.user.id,
    title: data.title,
    prompt: data.prompt,
    deployment_target: data.deployment,
    generated_prd: data.prdContent,
  });

  revalidatePath("/dashboard");
}
7. Halaman Pengaturan (API Key Pribadi)
Form sederhana dengan input password untuk API key, dan select provider. Gunakan Server Action untuk menyimpan terenkripsi (backend yang menangani enkripsi).
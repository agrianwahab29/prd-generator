import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { getDb } from "@/db";
import { projects } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import { Plus, FolderOpen } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ProjectsGrid, EmptyState } from "@/components/dashboard-projects";
import { redirect } from "next/navigation";

export const revalidate = 0; // Always fresh data

export default async function DashboardPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  // Server-side data fetch - no client-side waterfall!
  let userProjects: Array<{
    id: string;
    title: string;
    prompt: string;
    deploymentTarget: string;
    updatedAt: Date;
    createdAt: Date;
  }> = [];

  try {
    userProjects = await getDb()
      .select({
        id: projects.id,
        title: projects.title,
        prompt: projects.prompt,
        deploymentTarget: projects.deploymentTarget,
        updatedAt: projects.updatedAt,
        createdAt: projects.createdAt,
      })
      .from(projects)
      .where(eq(projects.userId, session.user.id))
      .orderBy(desc(projects.createdAt));
  } catch (error) {
    console.error("Failed to fetch projects:", error);
  }

  return (
    <div className="space-y-8 max-w-6xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 animate-slide-up">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500/10 to-violet-500/10 border border-indigo-200/50">
              <FolderOpen className="h-5 w-5 text-indigo-600" />
            </div>
            <div>
              <span className="text-xs font-semibold text-indigo-600/80 uppercase tracking-wider">
                Dashboard
              </span>
              <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
                Proyek Saya
              </h1>
            </div>
          </div>
          <p className="text-slate-500 text-base max-w-xl leading-relaxed">
            Kelola dan lihat semua PRD yang telah Anda buat dengan AI
          </p>
        </div>
        <Button
          className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white gap-2 shadow-lg shadow-indigo-500/25 h-11 px-5 rounded-xl font-medium btn-hover-lift"
          asChild
        >
          <Link href="/dashboard/generate">
            <Plus className="h-4 w-4" />
            Buat PRD Baru
          </Link>
        </Button>
      </div>

      {/* Projects Grid or Empty State */}
      {userProjects && userProjects.length > 0 ? (
        <ProjectsGrid projects={userProjects} />
      ) : (
        <EmptyState />
      )}
    </div>
  );
}

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect, notFound } from "next/navigation";
import { getDb } from "@/db";
import { projects } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { MarkdownRenderer } from "@/components/markdown-renderer";
import { ProjectDetailActions } from "@/components/project-detail-actions";

interface ProjectPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ProjectDetailPage({ params }: ProjectPageProps) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  const { id } = await params;

  // Server-side data fetch
  const projectData = await getDb()
    .select({
      id: projects.id,
      title: projects.title,
      prompt: projects.prompt,
      deploymentTarget: projects.deploymentTarget,
      generatedPrd: projects.generatedPrd,
      createdAt: projects.createdAt,
    })
    .from(projects)
    .where(and(eq(projects.id, id), eq(projects.userId, session.user.id)))
    .limit(1);

  if (projectData.length === 0) {
    notFound();
  }

  const project = projectData[0];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Client-side interactive actions */}
      <ProjectDetailActions
        projectId={project.id}
        projectTitle={project.title}
        projectContent={project.generatedPrd}
        projectPrompt={project.prompt}
        projectDeployment={project.deploymentTarget}
        projectCreatedAt={project.createdAt}
      />

      <Separator className="bg-[#E2E8F0]" />

      {/* Original Prompt */}
      <Card className="border-[#E2E8F0] bg-[#F8FAFC]">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-[#64748B]">
            Prompt Asli
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-[#475569]">{project.prompt}</p>
        </CardContent>
      </Card>

      {/* PRD Content - Server Rendered Markdown */}
      <Card className="border-[#E2E8F0]">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-[#0F172A]">
            Dokumen PRD
          </CardTitle>
          <CardDescription>
            Dokumen spesifikasi lengkap untuk proyek ini
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Server-side markdown rendering - keeps react-markdown out of client bundle! */}
          <MarkdownRenderer content={project.generatedPrd} />
        </CardContent>
      </Card>
    </div>
  );
}

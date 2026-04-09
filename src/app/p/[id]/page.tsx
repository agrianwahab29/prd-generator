import Link from "next/link";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import * as dateFnsLocale from "date-fns/locale";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Metadata } from "next";
import { getPublicProject } from "@/app/actions/public";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  FileText,
  Clock,
  Cloud,
  Globe,
  Server,
  LayoutTemplate,
  ArrowLeft,
} from "lucide-react";

interface PublicProjectPageProps {
  params: Promise<{
    id: string;
  }>;
}

const deploymentIcons: Record<string, React.ReactNode> = {
  vercel: <Cloud className="h-4 w-4" />,
  netlify: <Globe className="h-4 w-4" />,
  vps: <Server className="h-4 w-4" />,
  cpanel: <LayoutTemplate className="h-4 w-4" />,
};

const deploymentLabels: Record<string, string> = {
  vercel: "Vercel",
  netlify: "Netlify",
  vps: "VPS",
  cpanel: "cPanel",
};

const deploymentColors: Record<string, string> = {
  vercel: "bg-black text-white",
  netlify: "bg-[#00C7B7] text-white",
  vps: "bg-[#475569] text-white",
  cpanel: "bg-[#FF6C2C] text-white",
};

export async function generateMetadata({
  params,
}: PublicProjectPageProps): Promise<Metadata> {
  const { id } = await params;
  const project = await getPublicProject(id);

  if (!project) {
    return {
      title: "PRD Not Found - AI PRD Generator",
      description: "The requested PRD could not be found.",
    };
  }

  return {
    title: `${project.title} - AI PRD Generator`,
    description: `Product Requirements Document for ${project.title}. Generated with AI PRD Generator.`,
    openGraph: {
      title: `${project.title} - AI PRD Generator`,
      description: `Product Requirements Document for ${project.title}. Generated with AI PRD Generator.`,
      type: "article",
    },
  };
}

export default async function PublicProjectPage({
  params,
}: PublicProjectPageProps) {
  const { id } = await params;
  const project = await getPublicProject(id);

  if (!project) {
    notFound();
  }

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
            <Link
              href="/"
              className="flex items-center gap-2 text-sm font-medium text-[#475569] transition-colors hover:text-[#4F46E5]"
            >
              <ArrowLeft className="h-4 w-4" />
              Kembali ke Beranda
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto max-w-4xl px-4 py-12 md:px-6 lg:px-8">
        <div className="space-y-6">
          {/* Project Header */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold text-[#0F172A]">
                {project.title}
              </h1>
              <Badge
                className={`${deploymentColors[project.deploymentTarget]} font-medium`}
              >
                <span className="mr-1">
                  {deploymentIcons[project.deploymentTarget]}
                </span>
                {deploymentLabels[project.deploymentTarget]}
              </Badge>
            </div>
            <div className="flex items-center gap-4 text-sm text-[#64748B]">
              <span className="flex items-center gap-1">
                <FileText className="h-4 w-4" />
                PRD #{id}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                Dibuat{" "}
                {format(new Date(project.createdAt), "d MMMM yyyy", {
                  locale: dateFnsLocale.id,
                })}
              </span>
            </div>
          </div>

          <Separator className="bg-[#E2E8F0]" />

          {/* PRD Content */}
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
              <div className="prose prose-slate max-w-none">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {project.generatedPrd}
                </ReactMarkdown>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#E2E8F0] bg-white py-8">
        <div className="container mx-auto max-w-4xl px-4 md:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-center gap-4">
            <Badge
              variant="secondary"
              className="bg-[#EEF2FF] text-[#4F46E5] hover:bg-[#E0E7FF]"
            >
              <FileText className="mr-1 h-3 w-3" />
              Dibuat dengan AI PRD Generator
            </Badge>
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

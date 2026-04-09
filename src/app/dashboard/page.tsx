import Link from "next/link";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  FileText,
  MoreVertical,
  Copy,
  Download,
  Trash2,
  Plus,
  Clock,
  Globe,
  Server,
  LayoutTemplate,
  Cloud,
} from "lucide-react";
import { getProjects } from "@/app/actions/projects";

const deploymentIcons: Record<string, React.ReactNode> = {
  vercel: <Cloud className="h-3 w-3" />,
  netlify: <Globe className="h-3 w-3" />,
  vps: <Server className="h-3 w-3" />,
  cpanel: <LayoutTemplate className="h-3 w-3" />,
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

export default async function DashboardPage() {
  const projects = await getProjects();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[#0F172A]">Proyek Saya</h2>
          <p className="text-[#475569]">
            Kelola dan lihat semua PRD yang telah Anda buat
          </p>
        </div>
        <Button
          className="bg-[#F97316] hover:bg-[#EA580C] text-white gap-2"
          asChild
        >
          <Link href="/dashboard/generate">
            <Plus className="h-4 w-4" />
            Buat PRD Baru
          </Link>
        </Button>
      </div>

      {/* Projects Grid */}
      {projects && projects.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project, index) => (
            <ProjectCard
              key={project.id}
              project={project}
              index={index}
            />
          ))}
        </div>
      ) : (
        <EmptyState />
      )}
    </div>
  );
}

function ProjectCard({
  project,
  index,
}: {
  project: NonNullable<Awaited<ReturnType<typeof getProjects>>[0]>;
  index: number;
}) {
  return (
    <Card className="group border-[#E2E8F0] hover:shadow-lg transition-all duration-200 hover:-translate-y-1 overflow-hidden animate-fade-in">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg font-semibold text-[#0F172A] truncate group-hover:text-[#4F46E5] transition-colors">
              <Link href={`/dashboard/projects/${project.id}`}>
                {project.title}
              </Link>
            </CardTitle>
            <CardDescription className="flex items-center gap-2 mt-1">
              <Clock className="h-3 w-3" />
              {format(new Date(project.updatedAt), "d MMMM yyyy", { locale: id })}
            </CardDescription>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-[#64748B] opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem className="gap-2">
                <Copy className="h-4 w-4" />
                Copy Markdown
              </DropdownMenuItem>
              <DropdownMenuItem className="gap-2">
                <Download className="h-4 w-4" />
                Download PDF
              </DropdownMenuItem>
              <DropdownMenuItem className="gap-2 text-[#F43F5E]">
                <Trash2 className="h-4 w-4" />
                Hapus
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-[#475569] line-clamp-2">{project.prompt}</p>
        <div className="flex items-center justify-between">
          <Badge
            variant="secondary"
            className={`text-xs font-medium ${
              deploymentColors[project.deploymentTarget]
            }`}
          >
            <span className="mr-1">{deploymentIcons[project.deploymentTarget]}</span>
            {deploymentLabels[project.deploymentTarget]}
          </Badge>
          <Button
            variant="ghost"
            size="sm"
            className="text-[#4F46E5] hover:text-[#4338CA] hover:bg-[#EEF2FF]"
            asChild
          >
            <Link href={`/dashboard/projects/${project.id}`}>
              <FileText className="h-4 w-4 mr-1" />
              Lihat
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function EmptyState() {
  return (
    <Card className="border-[#E2E8F0] border-dashed">
      <CardContent className="flex flex-col items-center justify-center py-16">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#EEF2FF] mb-4">
          <FileText className="h-8 w-8 text-[#4F46E5]" />
        </div>
        <h3 className="text-lg font-semibold text-[#0F172A] mb-2">
          Belum ada proyek
        </h3>
        <p className="text-[#475569] text-center max-w-sm mb-6">
          Mulai dengan membuat PRD pertama Anda. Deskripsikan ide aplikasi dan
          biarkan AI menghasilkan dokumen spesifikasi lengkap.
        </p>
        <Button
          className="bg-[#F97316] hover:bg-[#EA580C] text-white gap-2"
          asChild
        >
          <Link href="/dashboard/generate">
            <Plus className="h-4 w-4" />
            Buat PRD Pertama
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}

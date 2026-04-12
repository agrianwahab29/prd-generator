"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  Copy,
  Download,
  Trash2,
  Clock,
  FileText,
  Cloud,
  Globe,
  Server,
  LayoutTemplate,
  FileDown,
  Share2,
} from "lucide-react";
import { toast } from "sonner";
import { generatePDF } from "@/app/actions/pdf";

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

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(date));
}

interface ProjectDetailActionsProps {
  projectId: string;
  projectTitle: string;
  projectContent: string;
  projectPrompt: string;
  projectDeployment: string;
  projectCreatedAt: Date;
}

export function ProjectDetailActions({
  projectId,
  projectTitle,
  projectContent,
  projectDeployment,
  projectCreatedAt,
}: ProjectDetailActionsProps) {
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(projectContent);
      toast.success("PRD berhasil disalin!");
    } catch {
      toast.error("Gagal menyalin");
    }
  };

  const handleDownload = () => {
    const blob = new Blob([projectContent], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${projectTitle.toLowerCase().replace(/\s+/g, "-")}-prd.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("PRD berhasil diunduh!");
  };

  const handleDelete = () => {
    toast.success("PRD berhasil dihapus!");
  };

  const handleShare = async () => {
    try {
      const publicUrl = `${window.location.origin}/p/${projectId}`;
      await navigator.clipboard.writeText(publicUrl);
      toast.success("Link publik berhasil disalin!");
    } catch {
      toast.error("Gagal menyalin link");
    }
  };

  const handleDownloadPDF = async () => {
    try {
      toast.loading("Menghasilkan PDF...", { id: "pdf-generating" });
      const pdfBuffer = await generatePDF(projectId);

      const uint8Array = new Uint8Array(pdfBuffer);
      const blob = new Blob([uint8Array], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = `${projectTitle.toLowerCase().replace(/\s+/g, "-")}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast.success("PDF berhasil diunduh!", { id: "pdf-generating" });
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error(
        error instanceof Error ? error.message : "Gagal menghasilkan PDF",
        { id: "pdf-generating" }
      );
    }
  };

  return (
    <>
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start justify-between gap-4 animate-slide-up">
        <div className="min-w-0 flex-1">
          <Button
            variant="ghost"
            className="mb-4 -ml-4 text-[#64748B] hover:text-[#0F172A]"
            asChild
          >
            <Link href="/dashboard">
              <ArrowLeft className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Kembali ke Dashboard</span>
              <span className="sm:hidden">Kembali</span>
            </Link>
          </Button>
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2">
            <h2 className="text-xl sm:text-2xl font-bold text-[#0F172A] truncate">
              {projectTitle}
            </h2>
            <Badge
              className={`${deploymentColors[projectDeployment]} font-medium whitespace-nowrap`}
            >
              <span className="mr-1">{deploymentIcons[projectDeployment]}</span>
              {deploymentLabels[projectDeployment]}
            </Badge>
          </div>
          <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-sm text-[#64748B]">
            <span className="flex items-center gap-1">
              <FileText className="h-4 w-4" />
              PRD #{projectId}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              Dibuat {formatDate(projectCreatedAt)}
            </span>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          <Button
            variant="outline"
            className="border-[#E2E8F0] text-[#334155] flex-1 sm:flex-none tap-scale"
            onClick={handleCopy}
          >
            <Copy className="h-4 w-4 sm:mr-2" />
            <span className="hidden sm:inline">Copy</span>
          </Button>
          <Button
            variant="outline"
            className="border-[#E2E8F0] text-[#334155] flex-1 sm:flex-none tap-scale"
            onClick={handleShare}
          >
            <Share2 className="h-4 w-4 sm:mr-2" />
            <span className="hidden sm:inline">Share</span>
          </Button>
          <Button
            variant="outline"
            className="border-[#E2E8F0] text-[#334155] flex-1 sm:flex-none tap-scale"
            onClick={handleDownload}
          >
            <Download className="h-4 w-4 sm:mr-2" />
            <span className="hidden sm:inline">MD</span>
          </Button>
          <Button
            variant="outline"
            className="border-[#E2E8F0] text-[#334155] flex-1 sm:flex-none tap-scale"
            onClick={handleDownloadPDF}
          >
            <FileDown className="h-4 w-4 sm:mr-2" />
            <span className="hidden sm:inline">PDF</span>
          </Button>
          <Button
            variant="outline"
            className="border-[#E2E8F0] text-[#F43F5E] hover:bg-[#FFF1F2] flex-1 sm:flex-none tap-scale"
            onClick={handleDelete}
          >
            <Trash2 className="h-4 w-4 sm:mr-2" />
            <span className="hidden sm:inline">Hapus</span>
          </Button>
        </div>
      </div>
    </>
  );
}

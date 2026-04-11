"use client";

import Link from "next/link";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { motion } from "framer-motion";
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
  FolderOpen,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const deploymentIcons: Record<string, React.ReactNode> = {
  vercel: <Cloud className="h-3.5 w-3.5" />,
  netlify: <Globe className="h-3.5 w-3.5" />,
  vps: <Server className="h-3.5 w-3.5" />,
  cpanel: <LayoutTemplate className="h-3.5 w-3.5" />,
};

const deploymentLabels: Record<string, string> = {
  vercel: "Vercel",
  netlify: "Netlify",
  vps: "VPS",
  cpanel: "cPanel",
};

const deploymentColors: Record<string, string> = {
  vercel: "bg-slate-900 text-white border-slate-800",
  netlify: "bg-[#00C7B7] text-white border-[#00B8A8]",
  vps: "bg-slate-600 text-white border-slate-500",
  cpanel: "bg-[#FF6C2C] text-white border-[#E55A1B]",
};

const deploymentGradients: Record<string, string> = {
  vercel: "from-slate-700 to-slate-900",
  netlify: "from-[#00D9C0] to-[#00C7B7]",
  vps: "from-slate-500 to-slate-600",
  cpanel: "from-[#FF8F5C] to-[#FF6C2C]",
};

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
};

interface Project {
  id: string;
  title: string;
  prompt: string;
  deploymentTarget: string;
  updatedAt: Date;
  createdAt: Date;
}

export default function DashboardPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadProjects() {
      try {
        const response = await fetch("/api/projects");
        if (!response.ok) throw new Error("Failed to fetch");
        const data = await response.json();
        setProjects(data);
      } catch (error) {
        console.error("Failed to load projects:", error);
        toast.error("Gagal memuat proyek");
      } finally {
        setIsLoading(false);
      }
    }
    loadProjects();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <motion.div
          className="flex gap-1.5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-2.5 h-2.5 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600"
              animate={{ y: [0, -10, 0] }}
              transition={{
                duration: 0.6,
                repeat: Infinity,
                delay: i * 0.15,
                ease: "easeInOut",
              }}
            />
          ))}
        </motion.div>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-4 text-sm text-slate-500 font-medium"
        >
          Memuat proyek...
        </motion.p>
      </div>
    );
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="space-y-8 max-w-6xl mx-auto"
    >
      {/* Header - Clean Editorial Style */}
      <motion.div
        variants={itemVariants}
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5"
      >
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
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button
            className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white gap-2 shadow-lg shadow-indigo-500/25 h-11 px-5 rounded-xl font-medium"
            asChild
          >
            <Link href="/dashboard/generate">
              <Plus className="h-4 w-4" />
              Buat PRD Baru
            </Link>
          </Button>
        </motion.div>
      </motion.div>

      {/* Projects Grid */}
      {projects && projects.length > 0 ? (
        <motion.div
          variants={containerVariants}
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
        >
          {projects.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} />
          ))}
        </motion.div>
      ) : (
        <EmptyState />
      )}
    </motion.div>
  );
}

function ProjectCard({
  project,
  index,
}: {
  project: Project;
  index: number;
}) {
  return (
    <motion.div
      variants={itemVariants}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
    >
      <Card className="group border-slate-200/80 bg-white/90 backdrop-blur-sm shadow-sm hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-300 overflow-hidden h-full">
        <CardHeader className="pb-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <Link
                href={`/dashboard/projects/${project.id}`}
                className="group/link"
              >
                <CardTitle className="text-lg font-semibold text-slate-900 truncate group-hover/link:text-indigo-600 transition-colors duration-200">
                  {project.title}
                </CardTitle>
              </Link>
              <CardDescription className="flex items-center gap-2 mt-2 text-slate-500">
                <Clock className="h-3.5 w-3.5" />
                <span className="text-xs">
                  {format(new Date(project.updatedAt), "d MMMM yyyy", {
                    locale: id,
                  })}
                </span>
              </CardDescription>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-slate-400 opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-slate-100 hover:text-slate-600"
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-48 border-slate-200/80 shadow-lg"
              >
                <DropdownMenuItem className="gap-2 cursor-pointer hover:bg-indigo-50">
                  <Copy className="h-4 w-4 text-indigo-500" />
                  <span className="text-slate-700">Copy Markdown</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="gap-2 cursor-pointer hover:bg-indigo-50">
                  <Download className="h-4 w-4 text-indigo-500" />
                  <span className="text-slate-700">Download PDF</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="gap-2 cursor-pointer text-rose-600 hover:bg-rose-50 hover:text-rose-700">
                  <Trash2 className="h-4 w-4" />
                  Hapus
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 pt-0">
          <p className="text-sm text-slate-600 line-clamp-2 leading-relaxed">
            {project.prompt}
          </p>
          <div className="flex items-center justify-between pt-3 border-t border-slate-100">
            <Badge
              variant="secondary"
              className={`text-xs font-medium px-2.5 py-1 rounded-lg border shadow-sm ${
                deploymentColors[project.deploymentTarget]
              }`}
            >
              <span className="mr-1.5">
                {deploymentIcons[project.deploymentTarget]}
              </span>
              {deploymentLabels[project.deploymentTarget]}
            </Badge>
            <Button
              variant="ghost"
              size="sm"
              className="text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50/80 gap-1.5 font-medium transition-all duration-200"
              asChild
            >
              <Link href={`/dashboard/projects/${project.id}`}>
                <FileText className="h-4 w-4" />
                Lihat
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function EmptyState() {
  return (
    <motion.div variants={itemVariants}>
      <Card className="border-slate-200/80 border-dashed bg-slate-50/50">
        <CardContent className="flex flex-col items-center justify-center py-20">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative mb-6"
          >
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500/10 to-violet-500/10 border border-indigo-200/50">
              <Sparkles className="h-10 w-10 text-indigo-500" />
            </div>
            <motion.div
              className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Plus className="h-4 w-4 text-white" />
            </motion.div>
          </motion.div>
          <h3 className="text-xl font-semibold text-slate-900 mb-2">
            Belum ada proyek
          </h3>
          <p className="text-slate-500 text-center max-w-md mb-8 leading-relaxed">
            Mulai dengan membuat PRD pertama Anda. Deskripsikan ide aplikasi dan
            biarkan AI menghasilkan dokumen spesifikasi lengkap secara otomatis.
          </p>
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white gap-2 shadow-lg shadow-indigo-500/25 h-11 px-6 rounded-xl font-medium"
              asChild
            >
              <Link href="/dashboard/generate">
                <Plus className="h-4 w-4" />
                Buat PRD Pertama
              </Link>
            </Button>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

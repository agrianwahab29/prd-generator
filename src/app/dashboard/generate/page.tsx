import { GenerateForm } from "@/components/generate-form";
import { Wand2 } from "lucide-react";

export default function GeneratePage() {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Section - Server Rendered */}
      <div className="flex items-start justify-between animate-slide-up">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 shadow-md">
              <Wand2 className="h-4 w-4 text-white" />
            </div>
            <span className="text-sm font-medium text-indigo-600 uppercase tracking-wide">
              AI Generator
            </span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900">
            Generate PRD
          </h2>
          <p className="text-slate-500 mt-1 max-w-xl">
            Deskripsikan ide proyek Anda dan biarkan AI menghasilkan dokumen spesifikasi yang lengkap dan profesional.
          </p>
        </div>
      </div>

      {/* Client Form Component */}
      <GenerateForm />
    </div>
  );
}

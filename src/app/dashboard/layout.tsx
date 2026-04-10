import Link from "next/link";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import {
  FileText,
  LayoutDashboard,
  Settings,
  LogOut,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { auth } from "@/lib/auth";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  const userName = session.user.name || "User";
  const userEmail = session.user.email || "";
  const userInitials = userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .substring(0, 2);

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 z-40 h-screen w-[280px] border-r border-[#E2E8F0] bg-white">
        {/* Logo */}
        <div className="flex h-16 items-center gap-3 border-b border-[#E2E8F0] px-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#4F46E5]">
            <FileText className="h-5 w-5 text-white" />
          </div>
          <span className="font-bold text-[#020617]">AI PRD Generator</span>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-1 p-4">
          <Button
            variant="ghost"
            className="justify-start gap-3 text-[#475569] hover:bg-[#F1F5F9] hover:text-[#0F172A]"
            asChild
          >
            <Link href="/dashboard">
              <LayoutDashboard className="h-5 w-5" />
              Dashboard
            </Link>
          </Button>
          <Button
            variant="ghost"
            className="justify-start gap-3 text-[#475569] hover:bg-[#F1F5F9] hover:text-[#0F172A]"
            asChild
          >
            <Link href="/dashboard/generate">
              <Sparkles className="h-5 w-5" />
              Generate PRD
            </Link>
          </Button>
          <Button
            variant="ghost"
            className="justify-start gap-3 text-[#475569] hover:bg-[#F1F5F9] hover:text-[#0F172A]"
            asChild
          >
            <Link href="/dashboard/settings">
              <Settings className="h-5 w-5" />
              Pengaturan
            </Link>
          </Button>
        </nav>

        <Separator className="mx-auto w-[240px] bg-[#E2E8F0]" />

        {/* User Profile */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <div className="flex items-center gap-3 rounded-lg border border-[#E2E8F0] bg-white p-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src="" alt="User" />
              <AvatarFallback className="bg-[#4F46E5] text-white">
                {userInitials}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-[#0F172A] truncate">
                {userName}
              </p>
              <p className="text-xs text-[#64748B] truncate">
                {userEmail}
              </p>
            </div>
            <form
              action={async () => {
                "use server";
                redirect("/api/auth/sign-out");
              }}
            >
              <Button
                type="submit"
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-[#64748B] hover:text-[#F43F5E]"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-[280px] min-h-screen">
        {/* Top Header */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-[#E2E8F0] bg-white/80 backdrop-blur-md px-8">
          <h1 className="text-xl font-semibold text-[#0F172A]">Dashboard</h1>
          <div className="text-sm text-[#64748B]">
            Selamat datang, {userName.split(" ")[0]}!
          </div>
        </header>

        {/* Page Content */}
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}

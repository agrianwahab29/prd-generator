"use client";

import { useState, createContext, useContext, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FileText,
  LayoutDashboard,
  Settings,
  Sparkles,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SignOutButton } from "@/components/SignOutButton";

// Context for dynamic page titles
interface DashboardContextType {
  pageTitle: string;
  setPageTitle: (title: string) => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (collapsed: boolean) => void;
  userName: string;
  userEmail: string;
  userInitials: string;
  isMobile: boolean;
}

const DashboardContext = createContext<DashboardContextType | null>(null);

export function useDashboard() {
  const context = useContext(DashboardContext);
  if (!context) throw new Error("useDashboard must be used within DashboardProvider");
  return context;
}

export function DashboardProvider({
  children,
  userName,
  userEmail,
}: {
  children: React.ReactNode;
  userName: string;
  userEmail: string;
}) {
  const [pageTitle, setPageTitle] = useState("Dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
      if (window.innerWidth < 1024) {
        setSidebarOpen(false);
      }
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const userInitials = userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .substring(0, 2);

  return (
    <DashboardContext.Provider
      value={{
        pageTitle,
        setPageTitle,
        sidebarOpen,
        setSidebarOpen,
        sidebarCollapsed,
        setSidebarCollapsed,
        userName,
        userEmail,
        userInitials,
        isMobile,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
}

function SidebarContent({
  sidebarCollapsed,
  sidebarOpen,
  setSidebarOpen,
  setSidebarCollapsed,
  isMobile,
  userName,
  userEmail,
  userInitials,
}: {
  sidebarCollapsed: boolean;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  isMobile: boolean;
  userName: string;
  userEmail: string;
  userInitials: string;
}) {
  const pathname = usePathname();

  const navItems = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/dashboard/generate", label: "Generate PRD", icon: Sparkles },
    { href: "/dashboard/settings", label: "Pengaturan", icon: Settings },
  ];

  const isActive = (href: string) => {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(href);
  };

  const sidebarWidth = sidebarCollapsed ? "w-[72px]" : "w-[260px]";
  const mobileWidth = "w-[280px]";

  return (
    <>
      {/* Mobile overlay */}
      {isMobile && sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden animate-in fade-in duration-200"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed left-0 top-0 z-50 h-screen bg-white border-r border-[#E2E8F0]
          transition-all duration-300 ease-in-out
          ${isMobile ? mobileWidth : sidebarWidth}
          ${isMobile ? (sidebarOpen ? "translate-x-0" : "-translate-x-full") : "translate-x-0"}
          lg:translate-x-0
        `}
      >
        {/* Logo */}
        <div
          className={`
            flex h-16 items-center border-b border-[#E2E8F0]
            ${sidebarCollapsed ? "justify-center px-3" : "gap-3 px-5"}
          `}
        >
          <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-[#4F46E5]">
            <FileText className="h-5 w-5 text-white" />
          </div>
          {!sidebarCollapsed && (
            <span className="font-bold text-[#020617] text-sm whitespace-nowrap animate-in fade-in slide-in-from-left-2 duration-200">
              AI PRD Generator
            </span>
          )}
          {/* Mobile close button */}
          {isMobile && (
            <Button
              variant="ghost"
              size="icon"
              className="ml-auto h-8 w-8 text-[#64748B]"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-1 p-3">
          {navItems.map((item) => {
            const active = isActive(item.href);
            return (
              <Button
                key={item.href}
                variant="ghost"
                className={`
                  justify-start gap-3 transition-all duration-200
                  ${sidebarCollapsed ? "px-2 justify-center" : "px-3"}
                  ${
                    active
                      ? "bg-[#EEF2FF] text-[#4F46E5] hover:bg-[#EEF2FF]"
                      : "text-[#475569] hover:bg-[#F1F5F9] hover:text-[#0F172A]"
                  }
                `}
                asChild
                title={sidebarCollapsed ? item.label : undefined}
              >
                <Link href={item.href}>
                  <item.icon className="h-5 w-5 flex-shrink-0" />
                  {!sidebarCollapsed && (
                    <span className="whitespace-nowrap animate-in fade-in duration-200">
                      {item.label}
                    </span>
                  )}
                </Link>
              </Button>
            );
          })}
        </nav>

        {!sidebarCollapsed && (
          <Separator className="mx-auto w-[220px] bg-[#E2E8F0]" />
        )}

        {/* Collapse toggle - desktop only */}
        {!isMobile && (
          <div className="px-3 py-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 mx-auto text-[#64748B] hover:text-[#0F172A]"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {sidebarCollapsed ? (
                <ChevronRight className="h-4 w-4" />
              ) : (
                <ChevronLeft className="h-4 w-4" />
              )}
            </Button>
          </div>
        )}

        {/* User Profile */}
        <div className="absolute bottom-0 left-0 right-0 p-3">
          <div
            className={`
              flex items-center rounded-lg border border-[#E2E8F0] bg-white
              ${sidebarCollapsed ? "justify-center p-2" : "gap-3 p-3"}
            `}
          >
            <Avatar className="h-9 w-9 flex-shrink-0">
              <AvatarImage src="" alt="User" />
              <AvatarFallback className="bg-[#4F46E5] text-white text-xs">
                {userInitials}
              </AvatarFallback>
            </Avatar>
            {!sidebarCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[#0F172A] truncate">
                  {userName}
                </p>
                <p className="text-xs text-[#64748B] truncate">
                  {userEmail}
                </p>
              </div>
            )}
            {!sidebarCollapsed && <SignOutButton />}
          </div>
        </div>
      </aside>
    </>
  );
}

export function DashboardShell({
  children,
  userName,
  userEmail,
}: {
  children: React.ReactNode;
  userName: string;
  userEmail: string;
}) {
  const {
    pageTitle,
    setPageTitle,
    sidebarOpen,
    setSidebarOpen,
    sidebarCollapsed,
    setSidebarCollapsed,
    userInitials,
    isMobile,
  } = useDashboard();

  const pathname = usePathname();

  // Update page title based on route
  useEffect(() => {
    if (pathname === "/dashboard") setPageTitle("Dashboard");
    else if (pathname.startsWith("/dashboard/generate")) setPageTitle("Generate PRD");
    else if (pathname.startsWith("/dashboard/settings")) setPageTitle("Pengaturan");
    else if (pathname.startsWith("/dashboard/projects/")) setPageTitle("Detail Proyek");
    else setPageTitle("Dashboard");
  }, [pathname, setPageTitle]);

  const marginLeft = isMobile ? "ml-0" : sidebarCollapsed ? "lg:ml-[72px]" : "lg:ml-[260px]";

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <SidebarContent
        sidebarCollapsed={sidebarCollapsed}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        setSidebarCollapsed={setSidebarCollapsed}
        isMobile={isMobile}
        userName={userName}
        userEmail={userEmail}
        userInitials={userInitials}
      />

      {/* Main Content */}
      <main className={`min-h-screen transition-all duration-300 ${marginLeft}`}>
        {/* Top Header */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-[#E2E8F0] bg-white/80 backdrop-blur-md px-4 lg:px-8">
          <div className="flex items-center gap-3">
            {/* Mobile hamburger */}
            {isMobile && (
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 text-[#475569] lg:hidden"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="h-5 w-5" />
              </Button>
            )}
            <h1 className="text-lg lg:text-xl font-semibold text-[#0F172A]">
              {pageTitle}
            </h1>
          </div>
          <div className="hidden sm:block text-sm text-[#64748B]">
            Selamat datang, {userName.split(" ")[0]}!
          </div>
        </header>

        {/* Page Content */}
        <div className="p-4 lg:p-8">{children}</div>
      </main>
    </div>
  );
}

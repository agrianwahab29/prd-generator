"use client";

import { useState, createContext, useContext, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  LayoutDashboard,
  Settings,
  Sparkles,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  Home,
} from "lucide-react";
import { Button } from "@/components/ui/button";
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

  const sidebarWidth = sidebarCollapsed ? "w-[80px]" : "w-[280px]";
  const mobileWidth = "w-[300px]";

  return (
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {isMobile && sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{
          width: isMobile ? (sidebarOpen ? 300 : 0) : sidebarCollapsed ? 80 : 280,
        }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className={`
          fixed left-0 top-0 z-50 h-screen 
          bg-slate-900/95 backdrop-blur-xl
          border-r border-slate-800/60
          ${isMobile ? (sidebarOpen ? "translate-x-0" : "-translate-x-full") : "translate-x-0"}
          lg:translate-x-0 overflow-hidden
        `}
      >
        <div className="h-full flex flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center border-b border-slate-800/60 px-5">
            <Link href="/dashboard" className="flex items-center gap-3 group">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 shadow-lg shadow-orange-500/20 group-hover:shadow-orange-500/30 transition-shadow">
                <FileText className="h-5 w-5 text-white" />
              </div>
              <AnimatePresence mode="wait">
                {!sidebarCollapsed && (
                  <motion.span
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.2 }}
                    className="font-bold text-white text-sm whitespace-nowrap"
                  >
                    AI PRD
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>
            
            {/* Mobile close button */}
            {isMobile && (
              <Button
                variant="ghost"
                size="icon"
                className="ml-auto h-8 w-8 text-slate-400 hover:text-white"
                onClick={() => setSidebarOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>

          {/* Navigation */}
          <nav className="flex-1 flex flex-col gap-1 p-3 overflow-y-auto">
            <div className="mb-2 px-3">
              <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                {sidebarCollapsed ? "Menu" : "Menu Utama"}
              </span>
            </div>
            
            {navItems.map((item, index) => {
              const active = isActive(item.href);
              const Icon = item.icon;
              
              return (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.3 }}
                >
                  <Link href={item.href} onClick={() => isMobile && setSidebarOpen(false)}>
                    <motion.div
                      whileHover={{ x: 2 }}
                      whileTap={{ scale: 0.98 }}
                      className={`
                        flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200
                        ${sidebarCollapsed ? "justify-center" : ""}
                        ${active
                          ? "bg-gradient-to-r from-amber-500/20 to-orange-500/10 text-amber-400 border border-amber-500/20"
                          : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200"
                        }
                      `}
                    >
                      <div className={`
                        flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center
                        ${active 
                          ? "bg-amber-500/20" 
                          : "bg-slate-800/50 group-hover:bg-slate-700/50"
                        }
                      `}>
                        <Icon className={`h-4 w-4 ${active ? "text-amber-400" : ""}`} />
                      </div>
                      
                      <AnimatePresence mode="wait">
                        {!sidebarCollapsed && (
                          <motion.span
                            initial={{ opacity: 0, width: 0 }}
                            animate={{ opacity: 1, width: "auto" }}
                            exit={{ opacity: 0, width: 0 }}
                            transition={{ duration: 0.2 }}
                            className="font-medium text-sm whitespace-nowrap"
                          >
                            {item.label}
                          </motion.span>
                        )}
                      </AnimatePresence>
                      
                      {active && !sidebarCollapsed && (
                        <motion.div
                          layoutId="activeIndicator"
                          className="ml-auto w-1.5 h-1.5 rounded-full bg-amber-400"
                        />
                      )}
                    </motion.div>
                  </Link>
                </motion.div>
              );
            })}
          </nav>

          {/* Collapse toggle - desktop only */}
          {!isMobile && (
            <div className="px-3 py-2 border-t border-slate-800/60">
              <Button
                variant="ghost"
                size="icon"
                className="w-full h-9 text-slate-500 hover:text-slate-300 hover:bg-slate-800/50"
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              >
                <motion.div
                  animate={{ rotate: sidebarCollapsed ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronLeft className="h-4 w-4" />
                </motion.div>
              </Button>
            </div>
          )}

          {/* User Profile */}
          <div className="p-3 border-t border-slate-800/60">
            <div className={`
              flex items-center rounded-xl border border-slate-700/50 bg-slate-800/30
              ${sidebarCollapsed ? "justify-center p-2" : "gap-3 p-3"}
            `}>
              <Avatar className="h-10 w-10 flex-shrink-0 ring-2 ring-slate-700/50">
                <AvatarImage src="" alt={userName} />
                <AvatarFallback className="bg-gradient-to-br from-amber-500 to-orange-600 text-white text-xs font-semibold">
                  {userInitials}
                </AvatarFallback>
              </Avatar>
              
              <AnimatePresence mode="wait">
                {!sidebarCollapsed && (
                  <motion.div
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: "auto" }}
                    exit={{ opacity: 0, width: 0 }}
                    transition={{ duration: 0.2 }}
                    className="flex-1 min-w-0"
                  >
                    <p className="text-sm font-medium text-slate-200 truncate">
                      {userName}
                    </p>
                    <p className="text-xs text-slate-500 truncate">
                      {userEmail}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
              
              <AnimatePresence mode="wait">
                {!sidebarCollapsed && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.2 }}
                  >
                    <SignOutButton />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </motion.aside>
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
    isMobile,
  } = useDashboard();

  const pathname = usePathname();

  useEffect(() => {
    if (pathname === "/dashboard") setPageTitle("Dashboard");
    else if (pathname.startsWith("/dashboard/generate")) setPageTitle("Generate PRD");
    else if (pathname.startsWith("/dashboard/settings")) setPageTitle("Pengaturan");
    else if (pathname.startsWith("/dashboard/projects/")) setPageTitle("Detail Proyek");
    else setPageTitle("Dashboard");
  }, [pathname, setPageTitle]);

  const marginLeft = isMobile ? "ml-0" : sidebarCollapsed ? "lg:ml-[80px]" : "lg:ml-[280px]";

  return (
    <div className="min-h-screen bg-slate-950">
      <SidebarContent
        sidebarCollapsed={sidebarCollapsed}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        setSidebarCollapsed={setSidebarCollapsed}
        isMobile={isMobile}
        userName={userName}
        userEmail={userEmail}
        userInitials={userName.split(" ").map((n) => n[0]).join("").toUpperCase().substring(0, 2)}
      />

      {/* Main Content */}
      <main className={`min-h-screen transition-all duration-300 ${marginLeft}`}>
        {/* Top Header */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-800/60 bg-slate-900/80 backdrop-blur-xl px-4 lg:px-6">
          <div className="flex items-center gap-3">
            {/* Mobile hamburger */}
            {isMobile && (
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 text-slate-400 hover:text-white hover:bg-slate-800/50 lg:hidden"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="h-5 w-5" />
              </Button>
            )}
            
            <div className="flex items-center gap-2">
              <Home className="h-4 w-4 text-slate-500" />
              <span className="text-slate-500">/</span>
              <h1 className="text-lg font-semibold text-white">
                {pageTitle}
              </h1>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800/50 border border-slate-700/50">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-sm text-slate-400">
                Halo, <span className="text-slate-200 font-medium">{userName.split(" ")[0]}</span>
              </span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-4 lg:p-6">
          {children}
        </div>
      </main>
    </div>
  );
}

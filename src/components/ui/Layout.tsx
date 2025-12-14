import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  FileText,
  Calendar,
  Menu,
  X,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Enforce dark mode purely by default (assuming index.css :root has dark vars)
  // or we can force it here just in case the class was left over
  React.useEffect(() => {
    document.documentElement.classList.add("dark");
    document.documentElement.classList.remove("light");
  }, []);

  const navItems = [
    { label: "Dashboard", path: "/", icon: LayoutDashboard },
    { label: "Corporate Billing", path: "/corporate", icon: FileText },
    { label: "Event Billing", path: "/events", icon: Calendar },
  ];

  return (
    <div className="flex min-h-screen bg-background text-foreground transition-colors duration-300 font-sans selection:bg-primary selection:text-primary-foreground">
      {/* Sidebar - Desktop Glass Panel */}
      <aside className="hidden md:flex w-72 flex-col fixed left-4 top-4 bottom-4 rounded-xl glass-panel border border-white/10 z-50 overflow-hidden shadow-2xl shadow-primary/5">
        <div className="flex items-center gap-3 p-6 border-b border-white/5 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-transparent opacity-50 blur-xl"></div>
          <div className="size-10 rounded-lg bg-primary/20 border border-primary/50 flex items-center justify-center text-primary shadow-[0_0_15px_rgba(0,240,255,0.3)]">
            <Zap className="size-6 neon-text" />
          </div>
          <div className="flex flex-col">
            <span className="font-heading font-bold text-xl tracking-wider text-white">
              NEXUS
            </span>
            <span className="text-xs text-primary/80 tracking-widest uppercase">
              Billing Sys
            </span>
          </div>
        </div>

        <nav className="flex-1 space-y-2 p-4">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "group flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-300 relative overflow-hidden",
                  isActive
                    ? "text-white shadow-[0_0_20px_rgba(0,240,255,0.15)] bg-primary/10 border border-primary/20"
                    : "text-muted-foreground hover:text-white hover:bg-white/5"
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeNav"
                    className="absolute inset-0 bg-primary/10 border-l-2 border-primary"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  />
                )}
                <item.icon
                  size={20}
                  className={cn(
                    "transition-transform duration-300 group-hover:scale-110",
                    isActive && "text-primary neon-text"
                  )}
                />
                <span className="relative z-10">{item.label}</span>
                {isActive && (
                  <div className="absolute right-3 size-1.5 rounded-full bg-primary shadow-[0_0_10px_#00f0ff]"></div>
                )}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Mobile Header Glass */}
      <div className="md:hidden fixed top-0 w-full z-50 glass border-b border-white/10 p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="size-8 rounded-lg bg-primary/20 flex items-center justify-center text-primary">
            <Zap className="size-5" />
          </div>
          <span className="font-heading font-bold text-lg text-white">
            NEXUS
          </span>
        </div>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 rounded-md hover:bg-white/10 text-white transition-colors"
        >
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 px-4 py-8 md:pl-80 md:pr-8 md:py-8 mt-16 md:mt-0 transition-all duration-300 min-h-screen">
        <div className="max-w-7xl mx-auto space-y-8 glass-panel md:bg-transparent md:border-none md:backdrop-blur-none p-4 md:p-0 rounded-xl">
          {children}
        </div>
      </main>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-background/95 backdrop-blur-3xl md:hidden pt-24 px-6"
          >
            <nav className="space-y-4">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center gap-4 px-6 py-4 rounded-xl text-lg font-medium transition-all",
                    location.pathname === item.path
                      ? "bg-primary/20 text-primary border border-primary/30 shadow-[0_0_20px_rgba(0,240,255,0.2)]"
                      : "bg-white/5 border border-white/5 text-muted-foreground"
                  )}
                >
                  <item.icon size={24} />
                  {item.label}
                </Link>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

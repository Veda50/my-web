"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { ClerkProvider } from "@clerk/nextjs";

import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import ClientPreloader from "@/components/Preloader/Client";

import { useTheme } from "@/contexts/ThemeContext";
import { useLanguage } from "@/contexts/LanguageContext";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [showPreloader, setShowPreloader] = useState(false);
  const [previousPathname, setPreviousPathname] = useState(pathname);

  const [activeSection, setActiveSection] = useState("hero");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const { isDarkMode, setTheme } = useTheme();
  const { language, setLanguage } = useLanguage();

  // Initial load: tampilkan preloader client
  useEffect(() => {
    setShowPreloader(true);

    const timer = setTimeout(() => {
      setIsInitialLoad(false);
      setShowPreloader(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  // Route change preloader (setelah initial)
  useEffect(() => {
    if (!isInitialLoad && pathname !== previousPathname) {
      setShowPreloader(true);
      setPreviousPathname(pathname);

      const timer = setTimeout(() => {
        setShowPreloader(false);
      }, 1200);

      return () => clearTimeout(timer);
    }
  }, [pathname, isInitialLoad, previousPathname]);

  // Scroll spy
  useEffect(() => {
    const handleScroll = () => {
      const sections = ["hero", "about", "journey", "portfolio", "testimonials", "contact"];
      const y = window.scrollY + 100;

      for (const id of sections) {
        const el = document.getElementById(id);
        if (el) {
          const { offsetTop, offsetHeight } = el;
          if (y >= offsetTop && y < offsetTop + offsetHeight) {
            setActiveSection(id);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    el?.scrollIntoView({ behavior: "smooth" });
    setSidebarOpen(false);
  };

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        isDarkMode ? "bg-slate-900 text-white" : "bg-gradient-to-br from-slate-50 to-slate-100"
      }`}
    >
      {/* Client Preloader di luar ClerkProvider */}
      {showPreloader && <ClientPreloader key={pathname} isInitialLoad={isInitialLoad} />}

      <ClerkProvider>
        {/* PENTING: konten tidak pernah di-opacity-0. Preloader menutup dari atas. */}
        <div className="transition-opacity duration-500">
          <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

          <Sidebar
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
            activeSection={activeSection}
            isDarkMode={isDarkMode}
            setIsDarkMode={(dark) => setTheme(dark ? "dark" : "light")}
            language={language === "en" ? "EN" : "ID"}
            setLanguage={(lang) => setLanguage(lang === "EN" ? "en" : "id")}
            scrollToSection={scrollToSection}
          />

          <main className="pt-20">{children}</main>
        </div>
      </ClerkProvider>

      {/* Global Styles */}
      <style jsx global>{`
        @keyframes marquee { 0% { transform: translateX(0%);} 100% { transform: translateX(-50%);} }
        .animate-marquee { animation: marquee 20s linear infinite; }

        /* Hindari wildcard * transition. Batasi pada elemen interaktif umum */
        a, button {
          transition:
            color 150ms cubic-bezier(0.4, 0, 0.2, 1),
            background-color 150ms cubic-bezier(0.4, 0, 0.2, 1),
            border-color 150ms cubic-bezier(0.4, 0, 0.2, 1),
            opacity 150ms cubic-bezier(0.4, 0, 0.2, 1),
            transform 150ms cubic-bezier(0.4, 0, 0.2, 1);
        }
        /* Font utility */
        .font-playfair { font-family: var(--font-playfair); }
      `}</style>
    </div>
  );
}

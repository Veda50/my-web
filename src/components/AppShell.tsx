"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { ClerkProvider } from "@clerk/nextjs";

import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import Preloader from "@/components/Preloader";

import { useTheme } from "@/contexts/ThemeContext";
import { useLanguage } from "@/contexts/LanguageContext";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const [activeSection, setActiveSection] = useState("hero");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const { isDarkMode, setTheme } = useTheme();
  const { language, setLanguage } = useLanguage();

  // scroll spy
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
    handleScroll(); // init saat load
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // smooth scroll helper
  const scrollToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    el?.scrollIntoView({ behavior: "smooth" });
    setSidebarOpen(false);
  };

  return (
    <div
      className={`min-h-screen ${
        isDarkMode
          ? "bg-slate-900 text-white"
          : "bg-gradient-to-br from-slate-50 to-slate-100"
      }`}
    >
      {/* Preloader akan remount setiap pathname berubah */}
      <Preloader key={pathname} />

      <ClerkProvider>
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
      </ClerkProvider>
      {/* Global keyframes yang sebelumnya ada di page */}
      <style jsx global>{`
        @keyframes marquee {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-marquee {
          animation: marquee 20s linear infinite;
        }
      `}</style>
    </div>
  );
}

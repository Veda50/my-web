"use client";

import { useEffect, useState } from "react";

interface ClientPreloaderProps {
  isInitialLoad?: boolean;
}

export default function ClientPreloader({ isInitialLoad = true }: ClientPreloaderProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [isExiting, setIsExiting] = useState(false);
  const [progress, setProgress] = useState(isInitialLoad ? 30 : 0);

  useEffect(() => {
    // Hapus SSR preloader hanya di sini (hindari race)
    const ssr = document.getElementById("ssr-preloader");
    if (ssr) ssr.remove();

    // Cursor
    const html = document.documentElement;
    const body = document.body;
    const prevHtmlCursor = html.style.cursor;
    const prevBodyCursor = body.style.cursor;
    html.style.cursor = "wait";
    body.style.cursor = "wait";

    const start = isInitialLoad ? 30 : 0;
    const duration = isInitialLoad ? 1700 : 1200;
    setProgress(start);

    const stepMs = Math.max(10, Math.floor(duration / Math.max(1, 100 - start)));
    const iv = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(iv);
          return 100;
        }
        return p + 1;
      });
    }, stepMs);

    const t = setTimeout(() => {
      setIsExiting(true);
      setTimeout(() => {
        html.style.cursor = prevHtmlCursor;
        body.style.cursor = prevBodyCursor;
        setIsLoading(false);
      }, 500);
    }, duration);

    return () => {
      clearInterval(iv);
      clearTimeout(t);
      html.style.cursor = prevHtmlCursor;
      body.style.cursor = prevBodyCursor;
    };
  }, [isInitialLoad]);

  if (!isLoading) return null;

  return (
    <div
      role="status"
      aria-busy={!isExiting}
      className={`fixed inset-0 z-50 flex items-center justify-center overflow-hidden transition-opacity duration-500 ${
        isExiting ? "opacity-0" : "opacity-100"
      }`}
    >
      {/* SOLID BASE */}
      <div className="absolute inset-0 bg-white dark:bg-slate-950" />

      {/* Backgrounds */}
      <div
        className="absolute inset-0 opacity-100 dark:opacity-0 transition-opacity duration-300"
        style={{ background: "linear-gradient(135deg, #ffffff 0%, #eff6ff 50%, #ffffff 100%)" }}
      />
      <div
        className="absolute inset-0 opacity-0 dark:opacity-100 transition-opacity duration-300"
        style={{ background: "linear-gradient(135deg, #020617 0%, #0f172a 50%, #020617 100%)" }}
      />

      {/* Orbs - Light */}
      <div
        className="absolute top-20 left-20 w-64 h-64 rounded-full blur-3xl animate-pulse opacity-100 dark:opacity-0 transition-opacity duration-300"
        style={{ backgroundColor: "rgba(191, 219, 254, 0.1)", animationDuration: "4s" }}
      />
      <div
        className="absolute bottom-20 right-20 w-80 h-80 rounded-full blur-3xl animate-pulse opacity-100 dark:opacity-0 transition-opacity duration-300"
        style={{ backgroundColor: "rgba(147, 197, 253, 0.1)", animationDuration: "5s", animationDelay: "1s" }}
      />

      {/* Orbs - Dark */}
      <div
        className="absolute top-20 left-20 w-64 h-64 rounded-full blur-3xl animate-pulse opacity-0 dark:opacity-100 transition-opacity duration-300"
        style={{ backgroundColor: "rgba(59, 130, 246, 0.05)", animationDuration: "4s" }}
      />
      <div
        className="absolute bottom-20 right-20 w-80 h-80 rounded-full blur-3xl animate-pulse opacity-0 dark:opacity-100 transition-opacity duration-300"
        style={{ backgroundColor: "rgba(96, 165, 250, 0.05)", animationDuration: "5s", animationDelay: "1s" }}
      />

      {/* Main Content */}
      <div className="relative z-10 text-center">
        {/* Spinner */}
        <div className="relative mx-auto mb-8 w-16 h-16">
          <div className="w-16 h-16 border-4 rounded-full animate-spin transition-colors duration-300 border-[rgba(219,234,254,1)] border-t-[rgb(37,99,235)] dark:!border-[rgba(30,58,138,1)] dark:!border-t-[rgb(96,165,250)]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full animate-pulse transition-colors duration-300 bg-[rgb(37,99,235)] dark:!bg-[rgb(96,165,250)]" />
        </div>

        {/* Brand + divider + progress (Client MENAMPILKAN %) */}
        <div>
          <h2
            className="pre-title font-playfair"
            style={{
              fontSize: "1.5rem",
              fontWeight: 300,
              letterSpacing: "0.1em",
              color: "#374151",
              marginBottom: "0.5rem",
              fontFamily: "var(--font-playfair)",
              transition: "color 0.3s ease",
              visibility: "hidden", // muncul saat html.font-ready
            }}
          >
            Veda Bezaleel
          </h2>
          <div
            className="pre-divider"
            style={{
              width: "6rem",
              height: "2px",
              background: "linear-gradient(90deg, transparent 0%, rgb(37, 99, 235) 50%, transparent 100%)",
              margin: "0 auto 1rem",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div
              className="pre-divider-shimmer"
              style={{
                position: "absolute",
                inset: 0,
                background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent)",
                animation: "shimmer 2s infinite",
              }}
            />
          </div>

          <p className="text-xs font-medium text-[#6b7280] dark:!text-[#9ca3af]">
            {isInitialLoad ? "Loading" : "Navigating"}... {Math.round(progress)}%
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        /* Font siap → tampilkan brand agar konsisten */
        :global(html.font-ready) .pre-title { visibility: visible !important; }
      `}</style>
    </div>
  );
}

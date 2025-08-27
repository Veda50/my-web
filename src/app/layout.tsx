// src/app/layout.tsx
import type React from "react";
import type { Metadata } from "next";
import { Playfair_Display, Source_Sans_3 } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import AppShell from "@/components/AppShell";

const playfair = Playfair_Display({ subsets: ["latin"], display: "swap", variable: "--font-playfair" });
const sourceSans = Source_Sans_3({ subsets: ["latin"], display: "swap", variable: "--font-source-sans" });

export const metadata: Metadata = {
  title: "Veda Bezaleel - Web Developer",
  description: "Discover my journey, achievements, and creative work in design and development",
  generator: "v0.app",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${playfair.variable} ${sourceSans.variable} antialiased`}>
      <body>
        {/* --- SSR Preloader: muncul di first paint --- */}
        <div id="ssr-preloader" style={{
          position: "fixed", inset: 0, zIndex: 9999, display: "flex",
          alignItems: "center", justifyContent: "center",
          background: "linear-gradient(135deg,#0ea5e9 0%,#3b82f6 25%,#06b6d4 50%,#0ea5e9 75%,#3b82f6 100%)"
        }}>
          <div style={{ position: "relative", width: 48, height: 48 }}>
            <div style={{
              position: "absolute", inset: 0, borderRadius: "9999px",
              border: "3px solid rgba(255,255,255,.6)", borderTopColor: "#fff",
              animation: "ssrspin 1s linear infinite"
            }} />
          </div>
          <style
            dangerouslySetInnerHTML={{
              __html: `
              @keyframes ssrspin { to { transform: rotate(360deg); } }
            `,
            }}
          />
        </div>
        {/* Hapus SSR preloader setelah ~300ms (atur sesuai selera, mis. 800/1500ms) */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
            (function(){
              var remove = function(){
                var el = document.getElementById('ssr-preloader');
                if (el && el.parentNode) el.parentNode.removeChild(el);
              };
              // Hapus cepat begitu halaman siap. Ubah durasi jika ingin lebih lama.
              if (document.readyState === 'complete') {
                setTimeout(remove, 300);
              } else {
                window.addEventListener('load', function(){ setTimeout(remove, 300); });
              }
            })();
          `,
          }}
        />
        {/* --- /SSR Preloader --- */}

        <ThemeProvider>
          <LanguageProvider>
            {/* AppShell: di sini kamu tetap punya Preloader client untuk TIAP route change */}
            <AppShell>{children}</AppShell>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

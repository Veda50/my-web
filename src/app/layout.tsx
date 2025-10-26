import type React from "react";
import type { Metadata } from "next";
import { Playfair_Display, Source_Sans_3 } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import AppShell from "@/components/AppShell";
import ServerPreloader from "@/components/Preloader/Server";

import { baseMetadata } from "@/seo/metadata";
import { personJsonLd, websiteJsonLd } from "@/seo/jsonld";

const playfair = Playfair_Display({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-playfair",
});

const sourceSans = Source_Sans_3({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-source-sans",
});

export const metadata: Metadata = {
  ...baseMetadata,
  other: {
    "application/ld+json": JSON.stringify([personJsonLd, websiteJsonLd]),
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${sourceSans.variable} antialiased`}
      suppressHydrationWarning
    >
      <head>
        {/* Theme detection – harus dieksekusi sebelum hydrate */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('theme') || 'light';
                  var isDark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
                  if (isDark) document.documentElement.classList.add('dark');
                } catch (e) {}
              })();
            `,
          }}
        />
        {/* Font readiness flag: cegah mismatch ukuran teks preloader */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function(){
                try {
                  if (document.fonts && document.fonts.ready) {
                    document.fonts.ready.then(function(){
                      document.documentElement.classList.add('font-ready');
                    });
                  } else {
                    // Fallback: tetap tampilkan agar tidak hidden permanen
                    setTimeout(function(){ document.documentElement.classList.add('font-ready'); }, 1200);
                  }
                } catch(e){}
              })();
            `,
          }}
        />
      </head>
      <body suppressHydrationWarning>
        {/* ServerPreloader di luar provider */}
        <ServerPreloader />

        {/* HAPUS remover script: penghapusan dihandle ClientPreloader */}

        <ThemeProvider>
          <LanguageProvider>
            <AppShell>{children}</AppShell>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

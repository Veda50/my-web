import type React from "react";
import type { Metadata } from "next";
import { Playfair_Display, Poppins, Rubik } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import AppShell from "@/components/AppShell";

import { baseMetadata } from "@/seo/metadata";
import { personJsonLd, websiteJsonLd } from "@/seo/jsonld";

const playfair = Playfair_Display({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-playfair",
});

const poppins = Poppins({
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-source-sans",
});

const rubik = Rubik({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
  variable: "--font-rubik-raw",
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
      className={`${playfair.variable} ${poppins.variable} ${rubik.variable} antialiased`}
      suppressHydrationWarning
    >
      <head>
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
                    setTimeout(function(){ document.documentElement.classList.add('font-ready'); }, 1200);
                  }
                } catch(e){}
              })();
            `,
          }}
        />
      </head>
      <body suppressHydrationWarning>
        <ThemeProvider>
          <LanguageProvider>
            <AppShell>{children}</AppShell>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

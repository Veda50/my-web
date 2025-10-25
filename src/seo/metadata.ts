// src/seo/metadata.ts
import type { Metadata } from "next";
import { site } from "./site";

export const baseMetadata: Metadata = {
  metadataBase: site.url,
  title: { default: site.titleDefault, template: site.titleTemplate },
  description: site.description,
  keywords: [
    "Veda Bezaleel",
    "Veda bezalel",
    "Veda",
    "Bezaleel",
    "Web Developer",
    "Frontend Developer",
    "Next.js",
    "React",
    "Portfolio",
  ],
  applicationName: "Veda Bezaleel",
  authors: [{ name: site.author, url: site.url.toString() }],
  creator: site.author,
  publisher: site.author,
  category: "Portfolio",
  alternates: {
    canonical: "/",
    // Remove this block if you don't have an Indonesian version yet:
    // languages: { "en-US": "/", "id-ID": "/id" },
  },
  openGraph: {
    type: "website",
    url: "/",
    siteName: site.name,
    title: site.titleDefault,
    description: site.description,
    // images: [{ url: site.ogImage, width: 1200, height: 630, alt: site.titleDefault }],
  },
//   twitter: {
    // card: "summary_large_image",
    // site: site.twitter,
    // creator: site.twitter,
    // title: site.titleDefault,
    // description: site.description,
    // images: [site.ogImage],
//   },
  robots: {
    index: true,
    follow: false,
    googleBot: {
      index: true,
      follow: false,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
  referrer: "origin-when-cross-origin",
  verification: {
    // Add your Search Console token when you verify the domain:
    // google: "PASTE_GOOGLE_SITE_VERIFICATION_TOKEN_HERE",
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
};

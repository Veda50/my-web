// src/seo/jsonld.ts
// HAPUS 'import Script from "next/script";'
import { site } from "./site";

// Ubah dari komponen 'JsonLdPerson' menjadi objek 'personJsonLd'
export const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Veda Bezaleel",
  alternateName: ["Veda bezalel"],
  url: site.url.toString(),
  // image: new URL(site.avatar, site.url).toString(),
  jobTitle: "Fullstack Engineer",
  worksFor: { "@type": "Organization", name: "Freelance" },
  sameAs: [
    "https://github.com/yourusername",
    "https://www.linkedin.com/in/yourusername",
    // Add more profiles if you like
  ],
};

// Ubah dari komponen 'JsonLdWebsite' menjadi objek 'websiteJsonLd'
export const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: site.name,
  url: site.url.toString(),
};

/* HAPUS SEMUA KODE LAMA INI:

export function JsonLdPerson() {
  return (
    <Script id="ld-person" ... />
  );
}

export function JsonLdWebsite() {
  return (
    <Script id="ld-website" ... />
  );
}

*/
// src/seo/jsonld.tsx
import Script from "next/script";
import { site } from "./site";

export function JsonLdPerson() {
  const data = {
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
  return (
    <Script id="ld-person" type="application/ld+json" strategy="beforeInteractive"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
  );
}

export function JsonLdWebsite() {
  // Use WebSite for site name eligibility. (Do NOT add SearchAction;
  // Google removed the sitelinks search box visual in 2024.)
  const data = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: site.name,
    url: site.url.toString(),
  };
  return (
    <Script id="ld-website" type="application/ld+json" strategy="beforeInteractive"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
  );
}

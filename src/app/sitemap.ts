// src/app/sitemap.ts
import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: "https://vedabe.com/", lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    // Add real routes below:
    // { url: "https://vedabe.com/about", lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    // { url: "https://vedabe.com/projects", lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
  ];
}

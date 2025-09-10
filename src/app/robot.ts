import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/" }],
    sitemap: "https://vedabe.com/sitemap.xml",
    host: "https://vedabe.com",
  };
}

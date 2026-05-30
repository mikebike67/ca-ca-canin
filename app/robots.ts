import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/spring-cleanup", "/fr/nettoyage-printemps"],
    },
    sitemap: "https://cacacanin.com/sitemap.xml",
    host: "https://cacacanin.com",
  };
}

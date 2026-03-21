import type { MetadataRoute } from "next";
import { SPRING_CLEANUP_LOCATIONS } from "@/lib/spring-cleanup-service-area";

const siteUrl = "https://cacacanin.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages = [
    "",
    "/fr",
    "/contact",
    "/fr/contact",
    "/spring-cleanup",
    "/fr/nettoyage-printemps",
    "/terms",
    "/fr/terms",
    "/privacy",
    "/fr/privacy",
  ];

  const staticEntries = staticPages.map((path) => ({
    url: `${siteUrl}${path}`,
    changeFrequency: "weekly" as const,
    priority: path === "" || path === "/fr" ? 1 : 0.8,
  }));

  const locationEntries = SPRING_CLEANUP_LOCATIONS.flatMap((location) => [
    {
      url: `${siteUrl}/spring-cleanup/${location.slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    },
    {
      url: `${siteUrl}/fr/nettoyage-printemps/${location.slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    },
  ]);

  return [...staticEntries, ...locationEntries];
}

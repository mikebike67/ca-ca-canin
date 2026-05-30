import type { MetadataRoute } from "next";
import { REGULAR_SERVICE_LOCATIONS } from "@/lib/regular-service-area";

const siteUrl = "https://cacacanin.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages = [
    "",
    "/fr",
    "/contact",
    "/fr/contact",
    "/spring-into-service",
    "/fr/printemps-en-service",
    "/dog-poop-cleanup",
    "/fr/ramassage-dejections",
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

  const regularServiceEntries = REGULAR_SERVICE_LOCATIONS.flatMap((location) => [
    {
      url: `${siteUrl}/dog-poop-cleanup/${location.slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    },
    {
      url: `${siteUrl}/fr/ramassage-dejections/${location.slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    },
  ]);

  return [...staticEntries, ...regularServiceEntries];
}

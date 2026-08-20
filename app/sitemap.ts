import type { MetadataRoute } from "next";
import { REGULAR_SERVICE_LOCATIONS } from "@/lib/regular-service-area";
import { BLOG_POSTS } from "@/lib/blog-posts";

const siteUrl = "https://cacacanin.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages = [
    "",
    "/fr",
    "/contact",
    "/fr/contact",
    "/dog-poop-cleanup",
    "/fr/ramassage-dejections",
    "/terms",
    "/fr/terms",
    "/privacy",
    "/fr/privacy",
    "/free-cleanup",
    "/fr/nettoyage-gratuit",
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

  const blogEntries = [
    { url: `${siteUrl}/blog`, changeFrequency: "weekly" as const, priority: 0.8 },
    { url: `${siteUrl}/fr/blogue`, changeFrequency: "weekly" as const, priority: 0.8 },
    ...BLOG_POSTS.flatMap((post) => [
      { url: `${siteUrl}/blog/${post.slug}`, changeFrequency: "monthly" as const, priority: 0.6 },
      { url: `${siteUrl}/fr/blogue/${post.slugFr}`, changeFrequency: "monthly" as const, priority: 0.6 },
    ]),
  ];

  return [...staticEntries, ...regularServiceEntries, ...blogEntries];
}

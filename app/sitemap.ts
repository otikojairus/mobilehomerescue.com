import type { MetadataRoute } from "next";
import { SEO_PAGES, getSiteUrl } from "@/lib/site-data";

export const revalidate = 3600;

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const base = getSiteUrl();
  return [
    { url: `${base}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/services`, lastModified: now, changeFrequency: "weekly", priority: 0.96 },
    ...SEO_PAGES.map((page) => ({
      url: `${base}${page.pageSlug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: page.priority === "Top Priority" ? 0.92 : page.priority === "High" ? 0.84 : 0.76,
    })),
  ];
}

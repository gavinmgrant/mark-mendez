import type { MetadataRoute } from "next";

import { getBaseUrl } from "@/config";
import { client } from "@/lib/sanity/client";
import { querySitemapData } from "@/lib/sanity/query";

const baseUrl = getBaseUrl();

// Revalidate sitemap daily (sitemaps don't need to update frequently)
export const revalidate = 86400;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { slugPages, blogPages, caseStudyIndex, caseStudyPages } =
    await client.fetch(querySitemapData);
  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    ...slugPages.map((page: any) => ({
      url: `${baseUrl}${page.slug}`,
      lastModified: new Date(page.lastModified ?? new Date()),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    ...blogPages.map((page: any) => ({
      url: `${baseUrl}${page.slug}`,
      lastModified: new Date(page.lastModified ?? new Date()),
      changeFrequency: "weekly" as const,
      priority: 0.5,
    })),
    ...(caseStudyIndex?.slug
      ? [
          {
            url: `${baseUrl}${caseStudyIndex.slug}`,
            lastModified: new Date(
              caseStudyIndex.lastModified ?? new Date(),
            ),
            changeFrequency: "weekly" as const,
            priority: 0.6,
          },
        ]
      : []),
    ...caseStudyPages.map((page: any) => ({
      url: `${baseUrl}${page.slug}`,
      lastModified: new Date(page.lastModified ?? new Date()),
      changeFrequency: "weekly" as const,
      priority: 0.5,
    })),
  ];
}

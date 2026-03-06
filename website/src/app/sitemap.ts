import type { MetadataRoute } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://clycites.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${siteUrl}/`, lastModified: now, changeFrequency: "weekly", priority: 1.0 },
    { url: `${siteUrl}/product`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${siteUrl}/solutions`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${siteUrl}/solutions/farmers`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${siteUrl}/solutions/organizations`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${siteUrl}/solutions/buyers`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${siteUrl}/solutions/partners`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${siteUrl}/how-it-works`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${siteUrl}/pricing`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${siteUrl}/resources`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${siteUrl}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${siteUrl}/contact`, lastModified: now, changeFrequency: "yearly", priority: 0.6 },
    { url: `${siteUrl}/security`, lastModified: now, changeFrequency: "yearly", priority: 0.5 },
    { url: `${siteUrl}/privacy`, lastModified: now, changeFrequency: "yearly", priority: 0.5 },
    { url: `${siteUrl}/terms`, lastModified: now, changeFrequency: "yearly", priority: 0.5 },
  ];

  return staticRoutes;
}

import type { MetadataRoute } from "next"
import { SITE_URL } from "@/lib/site"

const lastModified = new Date()

export default function sitemap(): MetadataRoute.Sitemap {
  // Generate surah pages
  const surahPages = Array.from({ length: 114 }, (_, i) => ({
    url: `${SITE_URL}/surah/${i + 1}`,
    lastModified,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }))

  return [
    {
      url: SITE_URL,
      lastModified,
      changeFrequency: "daily",
      priority: 1.0,
    },
    ...surahPages,
  ]
}

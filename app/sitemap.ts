import { MetadataRoute } from 'next'

const BASE_URL = 'https://quran.umamalfarizi.is-a.dev'

export default function sitemap(): MetadataRoute.Sitemap {
  // Generate surah pages
  const surahPages = Array.from({ length: 114 }, (_, i) => ({
    url: `${BASE_URL}/surah/${i + 1}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }))

  return [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    ...surahPages,
  ]
}

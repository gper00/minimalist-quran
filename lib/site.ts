// Single source of truth for the canonical public URL.
// Set NEXT_PUBLIC_SITE_URL in the deployment environment (e.g. Vercel) so
// metadata, sitemap and robots all point at the production domain.
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || "https://quran.umamalfarizi.is-a.dev"

export const SITE_NAME = "Al-Quran Digital"

export const SITE_DESCRIPTION =
  "Aplikasi Al-Quran digital minimalis untuk pengalaman membaca yang fokus dan khusyuk. Lengkap dengan terjemahan, tafsir, dan audio murottal."

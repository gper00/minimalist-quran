import { getAllSurahs } from "@/lib/api"
import { Header } from "@/components/header"
import { SurahList } from "@/components/surah-list"
import { ContinueReading } from "@/components/continue-reading"
import { DailyVerse } from "@/components/daily-verse"
import type { Surah } from "@/lib/types"
import { JsonLd } from "@/components/json-ld"
import { SITE_NAME, SITE_URL } from "@/lib/site"

export default async function HomePage() {
  const surahs: Surah[] = await getAllSurahs()

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": SITE_NAME,
    "url": SITE_URL,
    "description": "Aplikasi Al-Quran digital minimalis untuk pengalaman membaca yang fokus dan khusyuk.",
    "inLanguage": "id-ID",
    "potentialAction": {
      "@type": "SearchAction",
      "target": `${SITE_URL}/?q={search_term_string}`,
      "query-input": "required name=search_term_string"
    }
  }

  return (
    <>
      <JsonLd data={jsonLd} />
      <div className="min-h-screen">
      <div className="pt-2 md:pt-6">
        <Header transparent />
      </div>

      <main className="container mx-auto px-3 max-w-5xl md:px-4">
        {/* Combined Hero + Continue Reading */}
        <ContinueReading />

        {/* Daily Verse - after hero */}
        <DailyVerse />

        {/* Surah/Juz List */}
        <SurahList surahs={surahs} />
      </main>

      <footer className="pt-8 pb-24 md:py-8 border-t border-border/10 text-xs text-muted-foreground/60">
        <div className="container mx-auto max-w-5xl px-4 flex items-center justify-between">
          <p>© {new Date().getFullYear()} Al-Quran Digital</p>
          <p>Made with ❤️ by <a href="https://umamalfarizi.is-a.dev" target="_blank" rel="noopener noreferrer" className="font-medium text-primary/60 hover:text-primary transition-colors">Umam Alfarizi</a></p>
        </div>
      </footer>
    </div>
    </>
  )
}

export const metadata = {
  title: "Al-Quran Digital - Daftar Surah",
  description: "Daftar lengkap 114 surah dalam Al-Quran dengan terjemahan dan audio",
  alternates: {
    canonical: "/",
  },
}

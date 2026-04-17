import { getAllSurahs } from "@/lib/api"
import { Header } from "@/components/header"
import { SurahList } from "@/components/surah-list"
import { ContinueReading } from "@/components/continue-reading"
import { DailyVerse } from "@/components/daily-verse"
import type { Surah } from "@/lib/types"

export default async function HomePage() {
  const surahs: Surah[] = await getAllSurahs()

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Al-Quran Digital",
    "url": "https://quran.umamalfarizi.is-a.dev",
    "description": "Aplikasi Al-Quran digital minimalis untuk pengalaman membaca yang fokus dan khusyuk.",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://quran.umamalfarizi.is-a.dev/?q={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="min-h-screen bg-background">
      <div className="pt-4">
        <Header />
      </div>

      <main className="container mx-auto px-4 max-w-5xl">
        {/* Combined Hero + Continue Reading */}
        <ContinueReading />

        {/* Daily Verse - after hero */}
        <DailyVerse />

        {/* Surah/Juz List */}
        <SurahList surahs={surahs} />
      </main>

      <footer className="py-8 border-t border-border/10 text-xs text-muted-foreground/60">
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
}

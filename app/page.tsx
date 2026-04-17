import { getAllSurahs } from "@/lib/api"
import { Header } from "@/components/header"
import { SurahList } from "@/components/surah-list"
import { ContinueReading } from "@/components/continue-reading"
import { DailyVerse } from "@/components/daily-verse"
import type { Surah } from "@/lib/types"

export default async function HomePage() {
  const surahs: Surah[] = await getAllSurahs()

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 max-w-5xl">
        {/* Combined Hero + Continue Reading */}
        <ContinueReading />

        {/* Daily Verse - after hero */}
        <DailyVerse />

        {/* Surah/Juz List */}
        <SurahList surahs={surahs} />
      </main>

      <footer className="py-10 pb-28 md:pb-10 border-t border-border/10 text-center text-xs text-muted-foreground/60">
        <p>© {new Date().getFullYear()} Al-Quran Digital</p>
      </footer>
    </div>
  )
}

export const metadata = {
  title: "Al-Quran Digital - Daftar Surah",
  description: "Daftar lengkap 114 surah dalam Al-Quran dengan terjemahan dan audio",
}

import { getAllSurahs } from "@/lib/api"
import { Header } from "@/components/header"
import { SurahList } from "@/components/surah-list"
import { ContinueReading } from "@/components/continue-reading"
import type { Surah } from "@/lib/types"

export default async function HomePage() {
  const surahs: Surah[] = await getAllSurahs()

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-3 md:px-4 py-4 md:py-6 max-w-4xl">
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">Al-Quran Digital</h1>
          <p className="text-muted-foreground">Bacaan yang khusyuk dan penuh makna</p>
        </div>

        <ContinueReading />

        <SurahList surahs={surahs} />
      </main>
    </div>
  )
}

export const metadata = {
  title: "Al-Quran Digital - Daftar Surah",
  description: "Daftar lengkap 114 surah dalam Al-Quran dengan terjemahan dan audio",
}

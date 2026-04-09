import { getAllSurahs } from "@/lib/api"
import { Header } from "@/components/header"
import { SurahList } from "@/components/surah-list"
import type { Surah } from "@/lib/types"

export default async function HomePage() {
  const surahs: Surah[] = await getAllSurahs()

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 max-w-5xl">
        {/* Minimalist Hero Section */}
        <section className="py-16 md:py-24 text-center space-y-6">
          <div className="space-y-2">
            <h1 className="text-4xl md:text-6xl font-black tracking-tight text-foreground">
              Al-Quran <span className="text-primary/40">Digital</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground font-medium max-w-2xl mx-auto">
              Bacaan yang khusyuk, jernih, dan penuh makna dalam genggaman Anda.
            </p>
          </div>
        </section>

        <SurahList surahs={surahs} />
      </main>

      <footer className="py-12 border-t border-border/10 text-center text-sm text-muted-foreground">
        <p>© {new Date().getFullYear()} Al-Quran Digital • Minimal & Clean</p>
      </footer>
    </div>
  )
}

export const metadata = {
  title: "Al-Quran Digital - Daftar Surah",
  description: "Daftar lengkap 114 surah dalam Al-Quran dengan terjemahan dan audio",
}

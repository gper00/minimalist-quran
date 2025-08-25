import { notFound } from "next/navigation"
import { getSurahDetail } from "@/lib/api"
import { Header } from "@/components/header"
import { SurahHeader } from "@/components/surah-header"
import { VerseCard } from "@/components/verse-card"
import { BackButton } from "@/components/back-button"
import type { SurahDetail } from "@/lib/types"

interface SurahPageProps {
  params: {
    number: string
  }
}

export default async function SurahPage({ params }: SurahPageProps) {
  const surahNumber = Number.parseInt(params.number)

  if (isNaN(surahNumber) || surahNumber < 1 || surahNumber > 114) {
    notFound()
  }

  const surahDetail: SurahDetail | null = await getSurahDetail(surahNumber)

  if (!surahDetail) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-6 max-w-4xl">
        <BackButton />

        <SurahHeader surah={surahDetail} />

        <div className="space-y-6">
          {surahDetail.verses.map((verse) => (
            <VerseCard
              key={verse.number}
              verse={verse}
              surahNumber={surahNumber}
              surahName={surahDetail.name}
              recitations={surahDetail.recitations}
              tafsir={surahDetail.tafsir?.id?.kemenag?.text?.[verse.number.toString()]}
            />
          ))}
        </div>
      </main>
    </div>
  )
}

export async function generateStaticParams() {
  // Generate paths for all 114 surahs
  const paths = Array.from({ length: 114 }, (_, i) => ({
    number: (i + 1).toString(),
  }))

  return paths
}

export async function generateMetadata({ params }: SurahPageProps) {
  const surahNumber = Number.parseInt(params.number)
  const surahDetail = await getSurahDetail(surahNumber)

  if (!surahDetail) {
    return {
      title: "Surah tidak ditemukan",
    }
  }

  return {
    title: `${surahDetail.name} - Al-Quran Digital`,
    description: `Baca Surah ${surahDetail.name} lengkap dengan terjemahan Indonesia dan audio`,
  }
}

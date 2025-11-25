import { notFound } from "next/navigation"
import Link from "next/link"
import { getSurahDetail } from "@/lib/api"
import { Header } from "@/components/header"
import { SurahHeader } from "@/components/surah-header"
import { BismillahIntro } from "@/components/bismillah-intro"
import { VerseCard } from "@/components/verse-card"
import { BackButton } from "@/components/back-button"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
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

  const previousSurah = surahNumber > 1 ? surahNumber - 1 : null
  const nextSurah = surahNumber < 114 ? surahNumber + 1 : null

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="container mx-auto px-2 md:px-4 py-3 md:py-6 max-w-4xl pb-20 md:pb-6">
        <BackButton />

        <SurahHeader surah={surahDetail} />

        {surahNumber !== 1 && surahNumber !== 9 && (
          <BismillahIntro surahNumber={surahNumber} surahName={surahDetail.name} />
        )}

        <div className="space-y-3 md:space-y-6">
          {surahDetail.verses.map((verse) => (
            <VerseCard
              key={verse.number}
              verse={verse}
              surahNumber={surahNumber}
              surahName={surahDetail.name}
              tafsir={surahDetail.tafsir?.id?.kemenag?.text?.[verse.number.toString()]}
            />
          ))}
        </div>

        <div className="mt-8 md:mt-12 flex items-center justify-between gap-4">
          {previousSurah ? (
            <Link href={`/surah/${previousSurah}`}>
              <Button variant="outline" className="flex items-center gap-2 bg-transparent">
                <ChevronLeft className="h-4 w-4" />
                <span>Surah Sebelumnya</span>
              </Button>
            </Link>
          ) : (
            <div />
          )}

          {nextSurah ? (
            <Link href={`/surah/${nextSurah}`}>
              <Button variant="outline" className="flex items-center gap-2 bg-transparent">
                <span>Surah Berikutnya</span>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </Link>
          ) : (
            <div />
          )}
        </div>
      </main>
    </div>
  )
}

export async function generateStaticParams() {
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

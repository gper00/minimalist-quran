import { notFound } from "next/navigation"
import Link from "next/link"
import { getSurahDetail, getAllSurahs } from "@/lib/api"
import { Header } from "@/components/header"
import { SurahHeader } from "@/components/surah-header"
import { BismillahIntro } from "@/components/bismillah-intro"
import { VerseCard } from "@/components/verse-card"
import { BackButton } from "@/components/back-button"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { SurahSidebar } from "@/components/surah-sidebar"
import { MobileSurahDrawer } from "@/components/mobile-surah-drawer"
import type { SurahDetail, Surah } from "@/lib/types"

interface SurahPageProps {
  params: Promise<{
    number: string
  }>
}

export default async function SurahPage({ params }: SurahPageProps) {
  const resolvedParams = await params
  const surahNumber = Number.parseInt(resolvedParams.number)

  if (isNaN(surahNumber) || surahNumber < 1 || surahNumber > 114) {
    notFound()
  }

  const [surahDetail, allSurahs] = await Promise.all([
    getSurahDetail(surahNumber),
    getAllSurahs()
  ])

  if (!surahDetail) {
    notFound()
  }

  const previousSurah = surahNumber > 1 ? surahNumber - 1 : null
  const nextSurah = surahNumber < 114 ? surahNumber + 1 : null

  return (
    <div className="h-screen bg-background transition-colors duration-300 overflow-hidden flex flex-col md:flex-row">
      {/* Sidebar - Integrated from Top to Bottom (Desktop) */}
      <aside className="hidden md:block w-72 lg:w-80 flex-shrink-0 border-r border-border/10 h-full">
        <SurahSidebar surahs={allSurahs} />
      </aside>

      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Navbar - Desktop & Mobile */}
        <div className="flex-none border-b border-border/10 sticky top-0 z-40 bg-background/95 backdrop-blur-md">
          <Header centeredBrand />
        </div>

        {/* Main Content Area */}
        <main className="flex-1 h-full overflow-y-auto scroll-smooth custom-scrollbar">
          {/* Added pb-36 to guarantee clearance above the MobileBottomBar */}
          <div className="px-4 md:px-12 py-6 md:py-10 pb-36 max-w-4xl mx-auto">
              <div className="flex items-center justify-between mb-8 md:mb-12">
                <BackButton />
                <div className="md:hidden">
                  <MobileSurahDrawer surahs={allSurahs} />
                </div>
              </div>

              <SurahHeader surah={surahDetail} />

            {surahNumber !== 1 && surahNumber !== 9 && (
              <BismillahIntro surahNumber={surahNumber} surahName={surahDetail.name} />
            )}

            <div className="space-y-4">
              {surahDetail.verses.map((verse) => (
                <VerseCard
                  key={verse.number}
                  verse={verse}
                  surahNumber={surahNumber}
                  surahName={surahDetail.name}
                  tafsir={surahDetail.tafsir?.id?.kemenag?.text?.[verse.number.toString()]}
                  totalVerses={surahDetail.number_of_ayah}
                />
              ))}
            </div>

              {/* Pagination */}
              <div className="mt-20 flex items-center justify-between gap-6 border-t border-border/10 pt-16">
                {previousSurah ? (
                  <Link href={`/surah/${previousSurah}`} className="flex-1 group">
                    <div className="p-4 rounded-2xl border border-border/60 hover:bg-muted/50 transition-all group-active:scale-[0.98]">
                      <div className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">
                        <ChevronLeft className="h-3 w-3" />
                        Sebelumnya
                      </div>
                      <div className="text-sm font-bold truncate group-hover:text-primary transition-colors">
                        Surah {previousSurah}
                      </div>
                    </div>
                  </Link>
                ) : (
                  <div className="flex-1" />
                )}

                {nextSurah ? (
                  <Link href={`/surah/${nextSurah}`} className="flex-1 group text-right">
                    <div className="p-4 rounded-2xl border border-border/60 hover:bg-muted/50 transition-all group-active:scale-[0.98]">
                      <div className="flex items-center justify-end gap-1 text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">
                        Selanjutnya
                        <ChevronRight className="h-3 w-3" />
                      </div>
                      <div className="text-sm font-bold truncate group-hover:text-primary transition-colors">
                        Surah {nextSurah}
                      </div>
                    </div>
                  </Link>
                ) : (
                  <div className="flex-1" />
                )}
              </div>
            </div>
          </main>
        </div>
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
  const resolvedParams = await params
  const surahNumber = Number.parseInt(resolvedParams.number)
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

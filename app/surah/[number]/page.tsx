import { notFound } from "next/navigation"
import Link from "next/link"
import { getSurahDetail, getAllSurahs } from "@/lib/api"
import { Header } from "@/components/header"
import { SurahHeader } from "@/components/surah-header"
import { BismillahIntro } from "@/components/bismillah-intro"
import { VerseCard } from "@/components/verse-card"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { SurahSidebar } from "@/components/surah-sidebar"
import { MobileSurahHeader } from "@/components/mobile-surah-header"
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

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Chapter",
    "name": `Surah ${surahDetail.name}`,
    "headline": `Surah ${surahDetail.name} (${surahDetail.name_translations?.id || ''})`,
    "description": `Baca Surah ${surahDetail.name} lengkap dengan terjemahan Indonesia, tafsir, dan audio.`,
    "position": surahNumber,
    "isPartOf": {
      "@type": "CreativeWork",
      "name": "Al-Quran Digital",
      "url": "https://quran.umamalfarizi.is-a.dev"
    }
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="h-screen bg-background transition-colors duration-300 overflow-hidden flex flex-col md:flex-row">
      {/* Sidebar - Desktop only */}
      <aside className="hidden md:block w-72 lg:w-80 flex-shrink-0 h-full bg-muted/30">
        <SurahSidebar surahs={allSurahs} />
      </aside>

      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Desktop Navbar */}
        <div className="hidden md:block flex-none border-b border-border/20 sticky top-0 z-40 bg-muted/20 backdrop-blur-md">
          <Header centeredBrand />
        </div>

        {/* Mobile Navbar - sticky, hides on scroll */}
        <div className="md:hidden flex-none sticky top-0 z-40">
          <MobileSurahHeader surahName={surahDetail.name} surahs={allSurahs} />
        </div>

        {/* Main Content Area */}
        <main className="flex-1 h-full overflow-y-auto scroll-smooth custom-scrollbar">
          <div className="px-4 md:px-8 lg:px-12 py-4 md:py-6 pb-32 md:pb-16 max-w-5xl mx-auto">
            {/* Desktop Breadcrumb */}
            <div className="hidden md:flex items-center justify-between mb-6">
              <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                <Link href="/" className="hover:text-primary transition-colors flex items-center gap-1 group">
                  <ChevronLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
                  Beranda
                </Link>
                <span className="opacity-40">/</span>
                <span className="text-foreground">{surahDetail.name}</span>
              </div>
            </div>

            <SurahHeader surah={surahDetail} />

            {surahNumber !== 1 && surahNumber !== 9 && (
              <BismillahIntro surahNumber={surahNumber} surahName={surahDetail.name} />
            )}

            <div className="space-y-3">
              {surahDetail.verses.map((verse) => (
                <VerseCard
                  key={verse.number}
                  verse={verse}
                  surahNumber={surahNumber}
                  surahName={surahDetail.name}
                  tafsir={surahDetail.tafsir?.id?.kemenag?.text?.[verse.number.toString()]}
                  totalVerses={surahDetail.verses.length}
                />
              ))}
            </div>

            {/* Pagination */}
            <div className="mt-12 flex items-center justify-between gap-4 border-t border-border/10 pt-8">
              {previousSurah ? (
                <Link href={`/surah/${previousSurah}`} className="flex-1 group">
                  <div className="p-3 rounded-xl border border-border/50 hover:bg-muted/50 transition-all group-active:scale-[0.98]">
                    <div className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-0.5">
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
                  <div className="p-3 rounded-xl border border-border/50 hover:bg-muted/50 transition-all group-active:scale-[0.98]">
                    <div className="flex items-center justify-end gap-1 text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-0.5">
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
    </>
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
    return { title: "Surah tidak ditemukan" }
  }

  const description = `Baca Surah ${surahDetail.name} (${surahDetail.name_translations?.id || ''}) - ${surahDetail.verses?.length || 0} ayat. Lengkap dengan terjemahan Indonesia, tafsir, dan audio.`

  return {
    title: `Surah ${surahDetail.name}`,
    description,
    openGraph: {
      title: `Surah ${surahDetail.name} - Al-Quran Digital`,
      description,
      type: 'article',
      url: `https://quran.umamalfarizi.is-a.dev/surah/${surahNumber}`,
    },
    twitter: {
      card: 'summary',
      title: `Surah ${surahDetail.name}`,
      description,
    },
  }
}

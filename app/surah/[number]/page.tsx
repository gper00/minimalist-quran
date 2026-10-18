import { notFound } from "next/navigation"
import { getSurahDetail, getAllSurahs } from "@/lib/api"
import { SurahHeader } from "@/components/surah-header"
import { BismillahIntro } from "@/components/bismillah-intro"
import { VerseCard } from "@/components/verse-card"
import { SurahReaderShell } from "@/components/surah-reader-shell"
import { ReaderBreadcrumb } from "@/components/reader-breadcrumb"
import { SurahPagination } from "@/components/surah-pagination"
import type { SurahDetail, Surah } from "@/lib/types"
import { JsonLd } from "@/components/json-ld"
import { SITE_NAME, SITE_URL } from "@/lib/site"

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
    "url": `${SITE_URL}/surah/${surahNumber}`,
    "position": surahNumber,
    "inLanguage": "id-ID",
    "isPartOf": {
      "@type": "Book",
      "name": SITE_NAME,
      "url": SITE_URL
    }
  }

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Beranda",
        "item": SITE_URL,
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": `Surah ${surahDetail.name}`,
        "item": `${SITE_URL}/surah/${surahNumber}`,
      },
    ],
  }

  return (
    <>
      <JsonLd data={jsonLd} />
      <JsonLd data={breadcrumbLd} />
      <div className="h-screen transition-colors duration-300 overflow-hidden flex flex-col">
        <SurahReaderShell surahs={allSurahs}>
          <div className="px-4 md:px-8 lg:px-12 pt-2 md:pt-4 pb-28 md:pb-16 max-w-5xl mx-auto">
            {/* Desktop Breadcrumb */}
            <ReaderBreadcrumb surahName={surahDetail.name} />

            <SurahHeader
              surah={{
                number_of_surah: surahDetail.number_of_surah,
                name: surahDetail.name,
                name_translations: surahDetail.name_translations,
                type: surahDetail.type,
                verseCount: surahDetail.verses.length,
              }}
            />

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
                  surahNameAr={surahDetail.name_translations?.ar}
                  totalVerses={surahDetail.verses.length}
                  surahVerses={surahDetail.verses}
                />
              ))}
            </div>

            {/* Pagination */}
            <SurahPagination previousSurah={previousSurah} nextSurah={nextSurah} />
          </div>
        </SurahReaderShell>
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
    alternates: {
      canonical: `/surah/${surahNumber}`,
    },
    openGraph: {
      title: `Surah ${surahDetail.name} - Al-Quran Digital`,
      description,
      type: 'article',
      url: `${SITE_URL}/surah/${surahNumber}`,
      // Next replaces the whole openGraph object per page, so the shared image
      // has to be repeated here or link previews end up with no image at all.
      siteName: SITE_NAME,
      locale: 'id_ID',
      images: [
        {
          url: '/icon-512x512.png',
          width: 512,
          height: 512,
          alt: `Surah ${surahDetail.name} - ${SITE_NAME}`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `Surah ${surahDetail.name}`,
      description,
      images: ['/icon-512x512.png'],
    },
  }
}

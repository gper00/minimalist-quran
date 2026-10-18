"use client"

import { useLanguage } from "@/hooks/use-language"

// Only the fields this header renders cross the server/client boundary. Passing
// the whole SurahDetail used to drag the entire tafsir into the page payload.
interface SurahHeaderProps {
  surah: {
    number_of_surah: number
    name: string
    name_translations: {
      ar: string
      id: string
      en?: string
    }
    type: string
    verseCount: number
  }
}

export function SurahHeader({ surah }: SurahHeaderProps) {
  const { language, t } = useLanguage()

  const getSurahName = () => {
    if (language === "en" && surah.name_translations?.en) {
      return surah.name_translations.en
    }
    return surah.name_translations?.id || surah.name
  }

  return (
    <div className="mb-5 border-b border-border/30 pb-5 md:mb-8 md:pb-6">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex items-center gap-2.5">
            <span className="inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-primary/10 px-1.5 text-[11px] font-bold text-primary">
              {surah.number_of_surah}
            </span>
            <h1 className="font-arabic text-2xl font-bold leading-tight text-foreground md:text-3xl">
              {surah.name_translations?.ar}
            </h1>
          </div>
          <p className="mt-1.5 text-sm text-muted-foreground">
            <span className="font-semibold text-foreground/80">{surah.name}</span>
            <span className="mx-1.5 text-muted-foreground/40">·</span>
            <span className="font-serif italic text-muted-foreground/70">{getSurahName()}</span>
          </p>
        </div>

        <div className="flex shrink-0 flex-col items-end gap-1.5 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">
          <span className="rounded-md bg-muted px-2 py-1">{surah.type === "Makkiyah" ? t("home.makkiyah") : t("home.madaniyah")}</span>
          <span className="pr-0.5">
            {surah.verseCount} {t("home.verses")}
          </span>
        </div>
      </div>
    </div>
  )
}

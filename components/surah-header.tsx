"use client"

import { useLanguage } from "@/hooks/use-language"
import type { SurahDetail } from "@/lib/types"

interface SurahHeaderProps {
  surah: SurahDetail
}

export function SurahHeader({ surah }: SurahHeaderProps) {
  const { language } = useLanguage()

  const getSurahName = () => {
    if (language === "en" && surah.name_translations?.en) {
      return surah.name_translations.en
    }
    return surah.name_translations?.id || surah.name
  }

  return (
    <div className="relative mb-6">
      {/* Decorative glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center gap-2 py-5 text-center md:gap-3 md:py-8">
        <h1 className="font-arabic text-3xl font-bold leading-snug text-foreground md:text-5xl">
          {surah.name_translations?.ar}
        </h1>
        <p className="flex flex-wrap items-center justify-center gap-x-2 gap-y-0.5 text-sm text-muted-foreground md:text-base">
          <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-primary/10 px-1.5 text-[11px] font-bold text-primary md:h-6 md:min-w-6 md:px-2 md:text-xs">
            {surah.number_of_surah}
          </span>
          <span className="font-semibold text-foreground/80">{surah.name}</span>
          <span aria-hidden className="text-muted-foreground/40">·</span>
          <span className="font-serif italic text-muted-foreground/70">{getSurahName()}</span>
        </p>
      </div>
    </div>
  )
}

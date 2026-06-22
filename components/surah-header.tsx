"use client"

import { useLanguage } from "@/hooks/use-language"
import type { SurahDetail } from "@/lib/types"

interface SurahHeaderProps {
  surah: SurahDetail
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
    <div className="relative mb-2">
      <div className="py-8 md:py-12">
        {/* Mobile: stacked centered layout */}
        <div className="flex flex-col items-center text-center md:hidden gap-2">
          <h1 className="font-arabic text-4xl font-bold text-foreground">
            {surah.name_translations?.ar}
          </h1>
          <div className="w-1.5 h-1.5 rounded-full bg-primary/30" />
          <p className="text-lg text-muted-foreground font-medium">
            {surah.name}
          </p>
          <p className="text-sm font-serif italic text-muted-foreground/60">
            {getSurahName()}
          </p>
        </div>

        {/* Desktop: horizontal layout */}
        <div className="hidden md:flex flex-col items-center text-center gap-2">
          <h1 className="font-arabic text-5xl font-bold text-foreground">
            {surah.name_translations?.ar}
          </h1>
          <div className="w-1.5 h-1.5 rounded-full bg-primary/30" />
          <p className="text-xl text-muted-foreground font-medium">
            {surah.name}
          </p>
          <p className="text-sm font-serif italic text-muted-foreground/60">
            {getSurahName()}
          </p>
        </div>
      </div>
    </div>
  )
}

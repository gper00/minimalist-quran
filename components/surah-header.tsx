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
    <div className="text-center py-8 md:py-12 mb-6 relative">
      {/* Ornamental top line */}
      <div className="flex items-center justify-center gap-4 mb-6">
        <span className="h-px w-12 bg-gradient-to-r from-transparent to-primary/30" />
        <span className="text-primary/40 font-arabic text-2xl">{surah.name_translations?.ar}</span>
        <span className="h-px w-12 bg-gradient-to-l from-transparent to-primary/30" />
      </div>

      <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-2">
        {surah.name}
      </h1>
      
      <p className="text-lg text-muted-foreground font-medium mb-3">{getSurahName()}</p>
      
      <div className="flex items-center justify-center gap-3 text-xs uppercase tracking-widest text-muted-foreground/60 font-semibold">
        <span>{surah.verses?.length || 0} {t("home.verses")}</span>
        <span className="w-1 h-1 rounded-full bg-primary/40" />
        <span>{surah.type}</span>
      </div>

      {/* Bottom ornamental divider */}
      <div className="flex items-center justify-center gap-3 mt-8">
        <span className="h-px flex-1 max-w-[80px] bg-gradient-to-r from-transparent to-border/40" />
        <span className="w-2 h-2 rounded-full bg-primary/20" />
        <span className="h-px flex-1 max-w-[80px] bg-gradient-to-l from-transparent to-border/40" />
      </div>
    </div>
  )
}

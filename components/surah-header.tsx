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
    <div className="relative mb-6">
      <div className="rounded-2xl border border-border/40 bg-muted/20 p-5 md:p-8">
        {/* Mobile: stacked centered layout */}
        <div className="flex flex-col items-center text-center md:hidden gap-3">
          <div className="w-14 h-14 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
            <span className="font-arabic text-2xl text-primary/80">
              {surah.name_translations?.ar}
            </span>
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              {surah.name}
            </h1>
            <p className="text-sm text-muted-foreground font-medium mt-0.5">{getSurahName()}</p>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <span className="px-2.5 py-1 rounded-lg bg-background border border-border/50 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              {surah.verses?.length || 0} {t("home.verses")}
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-background border border-border/50 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              {surah.type}
            </span>
          </div>
        </div>

        {/* Desktop: horizontal layout */}
        <div className="hidden md:flex md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0">
              <span className="font-arabic text-3xl text-primary/80">
                {surah.name_translations?.ar}
              </span>
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-foreground">
                {surah.name}
              </h1>
              <p className="text-sm text-muted-foreground font-medium mt-0.5">{getSurahName()}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="px-3 py-1.5 rounded-lg bg-background border border-border/50 text-xs font-bold uppercase tracking-wider text-muted-foreground">
              {surah.verses?.length || 0} {t("home.verses")}
            </span>
            <span className="px-3 py-1.5 rounded-lg bg-background border border-border/50 text-xs font-bold uppercase tracking-wider text-muted-foreground">
              {surah.type}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

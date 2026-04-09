"use client"

import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useLanguage } from "@/hooks/use-language"
import type { Surah } from "@/lib/types"

interface SurahCardProps {
  surah: Surah
  mode?: "grid" | "list"
}

export function SurahCard({ surah, mode = "grid" }: SurahCardProps) {
  const { language, t } = useLanguage()

  const getSurahName = () => {
    if (language === "en" && surah.name_translations.en) {
      return surah.name_translations.en
    }
    return surah.name_translations.id
  }

  if (mode === "list") {
    return (
      <Link href={`/surah/${surah.number_of_surah}`} className="group block">
        <div className="flex items-center justify-between p-4 rounded-xl border border-border/50 hover:bg-primary/5 hover:border-primary/20 transition-all duration-300">
          <div className="flex items-center gap-4">
            <span className="text-sm font-bold text-muted-foreground w-6">{surah.number_of_surah}</span>
            <div className="flex flex-col">
              <span className="font-bold text-foreground group-hover:text-primary transition-colors">{surah.name}</span>
              <span className="text-xs text-muted-foreground font-medium">{getSurahName()} • {surah.number_of_ayah} Ayat</span>
            </div>
          </div>
          <span className="font-arabic text-xl text-foreground/80 group-hover:text-primary transition-colors">{surah.name_translations.ar}</span>
        </div>
      </Link>
    )
  }

  return (
    <Link href={`/surah/${surah.number_of_surah}`} className="group block">
      <div className="relative h-full p-6 rounded-2xl border border-border/60 bg-card hover:bg-primary/[0.02] hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 overflow-hidden">
        {/* Background Number Ornament */}
        <div className="absolute -top-4 -left-4 w-24 h-24 bg-primary/5 rounded-full flex items-center justify-center blur-2xl group-hover:bg-primary/10 transition-colors" />
        
        <div className="relative z-10 flex flex-col h-full gap-6">
          <div className="flex justify-between items-start">
            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">
              {surah.number_of_surah}
            </div>
            <p className="text-2xl font-arabic text-foreground group-hover:scale-110 transition-transform duration-300 origin-right">
              {surah.name_translations.ar}
            </p>
          </div>

          <div className="space-y-1 mt-auto">
            <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors tracking-tight">
              {surah.name}
            </h3>
            <p className="text-sm text-muted-foreground font-medium uppercase tracking-wide opacity-80">
              {getSurahName()}
            </p>
          </div>

          <div className="pt-4 border-t border-border/10 flex items-center justify-between text-xs font-bold text-muted-foreground/60 uppercase tracking-widest">
            <span>{surah.number_of_ayah} {t("home.verses")}</span>
            <span className="bg-muted px-2 py-1 rounded-md">{surah.type}</span>
          </div>
        </div>
      </div>
    </Link>
  )
}

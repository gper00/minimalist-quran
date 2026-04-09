"use client"

import { Card, CardContent } from "@/components/ui/card"
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

  const getBismillahTranslation = () => {
    if (language === "en") {
      return "In the name of Allah, the Entirely Merciful, the Especially Merciful."
    }
    return "Dengan menyebut nama Allah Yang Maha Pemurah lagi Maha Penyayang."
  }

  return (
    <div className="text-center py-10 md:py-16 mb-8 border-b border-border/10">
      <div className="space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground">
          {surah.name}
        </h1>
        <div className="flex flex-col items-center gap-2">
          <p className="text-xl md:text-2xl text-muted-foreground font-medium">{getSurahName()}</p>
          <div className="flex items-center gap-3 text-sm uppercase tracking-widest text-muted-foreground/60 font-semibold">
            <span>{surah.verses?.length || 0} {t("home.verses")}</span>
            <span className="w-1.5 h-1.5 rounded-full bg-primary/30" />
            <span>{surah.type}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

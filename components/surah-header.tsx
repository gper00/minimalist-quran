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
    <Card className="mb-8 border-primary/20">
      <CardContent className="p-6">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-foreground mb-2">{surah.name}</h1>
          <p className="text-lg text-muted-foreground mb-1">{getSurahName()}</p>
          <p className="text-sm text-muted-foreground mb-4">
            {surah.verses?.length || 0} {t("home.verses")} • {surah.type}
          </p>

          {/* Bismillah for all surahs except At-Taubah (9) */}
          {surah.number_of_surah !== 9 && (
            <div className="mb-6 p-4 bg-muted/30 rounded-lg border border-border/50">
              <p className="font-arabic text-2xl text-center text-foreground mb-3">بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ</p>
              <p className="text-sm text-muted-foreground text-center">{getBismillahTranslation()}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

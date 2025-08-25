"use client"

import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useLanguage } from "@/hooks/use-language"
import type { Surah } from "@/lib/types"

interface SurahCardProps {
  surah: Surah
}

export function SurahCard({ surah }: SurahCardProps) {
  const { language, t } = useLanguage()

  const getSurahName = () => {
    if (language === "en" && surah.name_translations.en) {
      return surah.name_translations.en
    }
    return surah.name_translations.id
  }

  const getTypeTranslation = () => {
    if (language === "en") {
      return surah.type === "Makkiyah" ? t("home.makkiyah") : t("home.madaniyah")
    }
    return surah.type
  }

  return (
    <Link href={`/surah/${surah.number_of_surah}`} className="block group">
      <Card className="hover:shadow-md transition-all duration-200 hover:border-primary/20 border-border/60 bg-card">
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            {/* Surah Number */}
            <div className="flex-shrink-0">
              <div className="w-12 h-12 rounded-lg bg-primary text-primary-foreground flex items-center justify-center font-bold text-base">
                {surah.number_of_surah}
              </div>
            </div>

            {/* Surah Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                    {surah.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">{getSurahName()}</p>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs font-medium">
                      {surah.number_of_ayah} {t("home.verses")}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {getTypeTranslation()}
                    </Badge>
                  </div>
                </div>

                {/* Arabic Name */}
                <div className="text-right">
                  <p className="text-xl font-arabic text-foreground">{surah.name_translations.ar}</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}

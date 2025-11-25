"use client"

import { Card, CardContent } from "@/components/ui/card"
import { useLanguage } from "@/hooks/use-language"

interface BismillahIntroProps {
  surahNumber: number
  surahName: string
}

export function BismillahIntro({ surahNumber, surahName }: BismillahIntroProps) {
  const { language, t } = useLanguage()

  const getBismillahTranslation = () => {
    if (language === "en") {
      return "In the name of Allah, the Entirely Merciful, the Especially Merciful."
    }
    return "Dengan menyebut nama Allah Yang Maha Pemurah lagi Maha Penyayang."
  }

  return (
    <Card className="mb-6 border-primary/20 bg-muted/20">
      <CardContent className="p-4">
        <div className="text-center space-y-2">
          <p className="font-arabic text-xl text-foreground">بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ</p>
          <p className="text-sm text-muted-foreground">{getBismillahTranslation()}</p>
        </div>
      </CardContent>
    </Card>
  )
}

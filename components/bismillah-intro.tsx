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
    <div className="py-20 mb-12 flex flex-col items-center justify-center space-y-6">
      <p className="font-arabic text-4xl md:text-5xl text-foreground/80 tracking-widest leading-relaxed">
        بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
      </p>
      <p className="text-sm md:text-base text-muted-foreground/60 font-medium max-w-lg text-center px-4 leading-relaxed tracking-wide">
        {getBismillahTranslation()}
      </p>
    </div>
  )
}

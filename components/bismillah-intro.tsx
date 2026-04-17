"use client"

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
    <div className="py-10 md:py-14 mb-6 flex flex-col items-center justify-center">
      {/* Ornamental top */}
      <div className="flex items-center gap-4 mb-6">
        <span className="h-px w-16 bg-gradient-to-r from-transparent to-primary/20" />
        <span className="w-1.5 h-1.5 rounded-full bg-primary/30" />
        <span className="h-px w-16 bg-gradient-to-l from-transparent to-primary/20" />
      </div>

      <p className="font-arabic text-3xl md:text-4xl text-foreground/80 tracking-wider leading-relaxed mb-3">
        بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
      </p>
      <p className="text-xs md:text-sm text-muted-foreground/50 font-medium max-w-md text-center px-4 leading-relaxed tracking-wide italic">
        {getBismillahTranslation()}
      </p>

      {/* Ornamental bottom */}
      <div className="flex items-center gap-4 mt-6">
        <span className="h-px w-16 bg-gradient-to-r from-transparent to-primary/20" />
        <span className="w-1.5 h-1.5 rounded-full bg-primary/30" />
        <span className="h-px w-16 bg-gradient-to-l from-transparent to-primary/20" />
      </div>
    </div>
  )
}

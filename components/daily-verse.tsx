"use client"

import { useState, useEffect } from "react"
import { Quote, Sparkles } from "lucide-react"
import { useLanguage } from "@/hooks/use-language"

const DAILY_VERSES = [
  {
    surah: "Al-Baqarah",
    verse: 286,
    arabic: "لَا يُكَلِّفُ اللَّهُ نَفْسًا إِلَّا وُسْعَهَا",
    translation: {
      id: "Allah tidak membebani seseorang melainkan sesuai dengan kesanggupannya.",
      en: "Allah does not burden a soul beyond that it can bear."
    }
  },
  {
    surah: "Ash-Sharh",
    verse: 5,
    arabic: "فَإِنَّ مَعَ الْعُسْرِ يُسْرًا",
    translation: {
      id: "Karena sesungguhnya sesudah kesulitan itu ada kemudahan.",
      en: "For indeed, with hardship [will be] ease."
    }
  },
  {
    surah: "Ar-Rahman",
    verse: 13,
    arabic: "فَبِأَيِّ آلَاءِ رَبِّكُمَا تُكَذِّبَانِ",
    translation: {
      id: "Maka nikmat Tuhan kamu yang manakah yang kamu dustakan?",
      en: "So which of the favors of your Lord would you deny?"
    }
  },
  {
    surah: "Ash-Shu'ara",
    verse: 80,
    arabic: "وَإِذَا مَرِضْتُ فَهُوَ يَشْفِينِ",
    translation: {
      id: "Dan apabila aku sakit, Dialah Yang menyembuhkan aku.",
      en: "And when I am ill, it is He who cures me."
    }
  },
  {
    surah: "At-Talaq",
    verse: 3,
    arabic: "وَيَرْزُقْهُ مِنْ حَيْثُ لَا يَحْتَسِبُ ۚ وَمَنْ يَتَوَكَّلْ عَلَى اللَّهِ فَهُوَ حَسْبُهُ",
    translation: {
      id: "Dan memberinya rezeki dari arah yang tiada disangka-sangkanya. Dan barangsiapa yang bertawakkal kepada Allah niscaya Allah akan mencukupkan keperluannya.",
      en: "And will provide for him from where he does not expect. And whoever relies upon Allah - then He is sufficient for him."
    }
  }
]

export function DailyVerse() {
  const { language } = useLanguage()
  const [randomVerse, setRandomVerse] = useState(DAILY_VERSES[0])
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    const today = new Date()
    const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 1000 / 60 / 60 / 24)
    const verseIndex = dayOfYear % DAILY_VERSES.length
    
    setRandomVerse(DAILY_VERSES[verseIndex])
    setIsMounted(true)
  }, [])

  if (!isMounted) return null

  return (
    <div className="mb-10 rounded-2xl border border-border/50 bg-muted/30 p-6 md:p-8 relative overflow-hidden">
      {/* Subtle decorative glow */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
      
      <div className="relative z-10 flex flex-col md:flex-row gap-6 md:gap-8">
        {/* Translation side */}
        <div className="flex-1 flex flex-col justify-center">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-4 h-4 text-primary/60" />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary/50">
              {language === "id" ? "Kutipan Hari Ini" : "Daily Verse"}
            </span>
          </div>
          
          <div className="relative">
            <Quote className="absolute -top-2 -left-3 w-6 h-6 text-foreground/5 rotate-180" />
            <p className="text-base md:text-lg leading-relaxed font-medium text-foreground/80 relative z-10 mb-3">
              &ldquo;{language === "id" ? randomVerse.translation.id : randomVerse.translation.en}&rdquo;
            </p>
          </div>
          
          <div className="flex gap-2 items-center text-xs font-medium text-muted-foreground/60">
            <span className="w-5 h-px bg-border" />
            {randomVerse.surah} • {language === "id" ? "Ayat" : "Verse"} {randomVerse.verse}
          </div>
        </div>

        {/* Arabic side */}
        <div className="md:w-[40%] flex items-center justify-end border-t md:border-t-0 md:border-l border-border/30 pt-5 md:pt-0 md:pl-8">
          <p className="font-arabic text-2xl md:text-3xl text-right leading-[1.8] text-primary/70">
            {randomVerse.arabic}
          </p>
        </div>
      </div>
    </div>
  )
}

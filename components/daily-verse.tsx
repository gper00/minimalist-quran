"use client"

import { useState, useEffect } from "react"
import { Quote, Sparkles } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
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
    // Generate random verse based on today's date so it changes exactly once per day
    const today = new Date()
    const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 1000 / 60 / 60 / 24)
    const verseIndex = dayOfYear % DAILY_VERSES.length
    
    setRandomVerse(DAILY_VERSES[verseIndex])
    setIsMounted(true)
  }, [])

  if (!isMounted) return null

  return (
    <Card className="mb-8 border-none overflow-hidden relative group rounded-3xl bg-slate-900 shadow-xl">
      {/* Decorative Golden Ornaments */}
      <div className="absolute top-0 right-0 p-32 bg-yellow-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-16 -left-16 p-24 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      
      <CardContent className="p-8 md:p-10 relative z-10 text-slate-50 flex gap-6 md:gap-8 flex-col md:flex-row shadow-inner">
        <div className="flex-1 flex flex-col justify-center">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-yellow-400" />
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-yellow-500/80">
              {language === "id" ? "Kutipan Hari Ini" : "Daily Verse"}
            </span>
          </div>
          
          <div className="relative">
            <Quote className="absolute -top-3 -left-4 w-8 h-8 text-white/5 rotate-180" />
            <p className="text-xl md:text-2xl leading-relaxed font-semibold text-white/90 relative z-10 mb-4">
              "{language === "id" ? randomVerse.translation.id : randomVerse.translation.en}"
            </p>
          </div>
          
          <div className="mt-auto pt-4 flex gap-2 items-center text-sm font-medium text-slate-400">
            <span className="w-6 h-px bg-slate-600"></span>
            {randomVerse.surah} • {language === "id" ? "Ayat" : "Verse"} {randomVerse.verse}
          </div>
        </div>

        <div className="md:w-[40%] flex items-center justify-end border-t md:border-t-0 md:border-l border-slate-700/50 pt-6 md:pt-0 md:pl-8">
          <p className="font-arabic text-3xl md:text-4xl text-right leading-[1.7] text-yellow-100 drop-shadow-sm">
            {randomVerse.arabic}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

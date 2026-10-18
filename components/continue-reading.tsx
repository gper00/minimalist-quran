"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { BookOpen, X, Clock, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getLastRead } from "@/lib/storage"
import { useLanguage } from "@/hooks/use-language"
import type { LastRead } from "@/lib/types"

export function ContinueReading() {
  const [lastRead, setLastRead] = useState<LastRead | null>(null)
  const [isHidden, setIsHidden] = useState(false)
  const { language, t } = useLanguage()

  useEffect(() => {
    // Check if user hid this in current session
    const hidden = sessionStorage.getItem("continue-reading-hidden")
    if (hidden === "true") {
      setIsHidden(true)
    }
    setLastRead(getLastRead())
  }, [])

  const handleHide = () => {
    sessionStorage.setItem("continue-reading-hidden", "true")
    setIsHidden(true)
  }

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) {
      return language === "id" ? "Baru saja" : "Just now"
    } else if (diffInHours < 24) {
      return language === "id" ? `${diffInHours} jam yang lalu` : `${diffInHours}h ago`
    } else {
      const diffInDays = Math.floor(diffInHours / 24)
      return language === "id" ? `${diffInDays} hari yang lalu` : `${diffInDays}d ago`
    }
  }

  return (
    <div className="mt-2 md:mt-6 mb-8 md:mb-12 rounded-3xl border border-border/40 glass shadow-sm overflow-hidden">
      {/* Hero Section */}
      <div className="px-5 md:px-10 pt-8 md:pt-14 pb-9 md:pb-16 text-center relative">
        {/* Decorative elements */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 w-40 h-40 bg-brand/10 rounded-full blur-3xl pointer-events-none" />

        <h1 className="relative text-[28px] leading-tight md:text-5xl font-black tracking-tight text-foreground mb-2.5">
          {language === "id" ? "Al-Quran" : "The Holy Quran"}{" "}
          <span className="text-brand/40">{language === "id" ? "Digital" : "Digital"}</span>
        </h1>
        <p className="relative text-sm md:text-base text-muted-foreground font-medium max-w-md mx-auto leading-relaxed">
          {language === "id"
            ? "Bacaan yang khusyuk, jernih, dan penuh makna."
            : "A serene, clear, and meaningful reading experience."}
        </p>
      </div>

      {/* Continue Reading Section */}
      {lastRead && !isHidden && (
        <div className="mx-3 md:mx-8 mb-3.5 md:mb-8 p-3.5 md:p-5 rounded-2xl border border-border/40 glass relative group transition-colors">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-brand/10 border border-brand/20 text-brand flex items-center justify-center flex-shrink-0">
                <BookOpen className="w-5 h-5" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-bold text-foreground text-sm tracking-tight">
                  {t("home.continue_reading")}
                </h3>
                <p className="text-foreground/60 text-xs">
                  {lastRead.surahName} <span className="mx-1 text-primary/30">•</span> {t("audio.verse")} {lastRead.verseNumber}
                </p>
                <div className="flex items-center gap-1 text-[11px] sm:text-[10px] text-muted-foreground/60 mt-1">
                  <Clock className="w-3 h-3" />
                  <span>{formatDate(lastRead.timestamp)}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto flex-shrink-0">
              <Button asChild className="flex-1 sm:flex-none text-[13px] sm:text-xs font-semibold shadow-sm shadow-brand/10 rounded-xl sm:rounded-lg px-4 h-10 sm:h-9">
                <Link href={`/surah/${lastRead.surahNumber}#verse-${lastRead.verseNumber}`} className="flex items-center justify-center gap-1.5">
                  {t("home.continue_reading")}
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleHide}
                className="h-10 w-10 sm:h-9 sm:w-9 flex-shrink-0 text-muted-foreground/50 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-xl sm:rounded-lg transition-colors"
                title={t("home.hide_temporarily")}
                aria-label={t("home.hide_temporarily")}
              >
                <X className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

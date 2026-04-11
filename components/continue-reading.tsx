"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { BookOpen, X, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { getLastRead, clearLastRead } from "@/lib/storage"
import { useLanguage } from "@/hooks/use-language"
import type { LastRead } from "@/lib/types"

export function ContinueReading() {
  const [lastRead, setLastRead] = useState<LastRead | null>(null)
  const { t } = useLanguage()

  useEffect(() => {
    setLastRead(getLastRead())
  }, [])

  const handleClearBookmark = () => {
    clearLastRead()
    setLastRead(null)
  }

  if (!lastRead) {
    return null
  }

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) {
      return "Baru saja"
    } else if (diffInHours < 24) {
      return `${diffInHours} jam yang lalu`
    } else {
      const diffInDays = Math.floor(diffInHours / 24)
      return `${diffInDays} hari yang lalu`
    }
  }

  return (
    <Card className="mb-8 border-primary/20 bg-gradient-to-br from-primary/15 via-primary/5 to-background shadow-lg shadow-primary/5 hover:shadow-xl hover:shadow-primary/10 hover:border-primary/40 transition-all duration-500 overflow-hidden relative group rounded-3xl">
      {/* Decorative Glow */}
      <div className="absolute top-0 right-0 p-32 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors duration-500 pointer-events-none" />
      
      <CardContent className="p-6 md:p-8 relative z-10">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="flex items-start md:items-center space-x-5 flex-1 min-w-0">
            {/* Animated Icon Wrapper */}
            <div className="relative w-14 h-14 flex-shrink-0">
              <div className="absolute inset-0 rounded-2xl bg-primary/20 animate-ping opacity-20" />
              <div className="relative w-full h-full rounded-2xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center backdrop-blur-sm">
                <BookOpen className="w-6 h-6 animate-pulse duration-1000" />
              </div>
            </div>

            <div className="space-y-1 min-w-0 flex-1">
              <h3 className="font-bold text-foreground text-base md:text-lg tracking-tight truncate">
                {t("home.continue_reading")}
              </h3>
              <p className="text-foreground/70 font-medium text-sm truncate">
                {lastRead.surahName} <span className="mx-1 text-primary/40">•</span> {t("audio.verse")} {lastRead.verseNumber}
              </p>
              <div className="flex items-center space-x-1.5 text-xs font-bold text-muted-foreground uppercase tracking-wider pt-1">
                <Clock className="w-3.5 h-3.5" />
                <span>{formatDate(lastRead.timestamp)}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 self-start md:self-center">
            <Button asChild size="default" className="text-xs md:text-sm shadow-md shadow-primary/20 rounded-xl px-6 transition-transform hover:scale-105">
              <Link href={`/surah/${lastRead.surahNumber}#verse-${lastRead.verseNumber}`}>
                Lanjutkan
              </Link>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleClearBookmark}
              className="h-10 w-10 text-muted-foreground hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-colors"
              title="Hapus penanda"
            >
              <X className="w-4.5 h-4.5" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

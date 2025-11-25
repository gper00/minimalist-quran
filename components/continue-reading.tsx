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
    <Card className="mb-8 border-primary/30 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent shadow-sm hover:shadow-md transition-all duration-300">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-start md:items-center space-x-4 flex-1 min-w-0">
            <div className="w-12 h-12 rounded-xl bg-primary text-primary-foreground flex items-center justify-center flex-shrink-0">
              <BookOpen className="w-6 h-6" />
            </div>
            <div className="space-y-1 min-w-0 flex-1">
              <h3 className="font-semibold text-foreground text-base md:text-lg truncate">
                {t("home.continue_reading")}
              </h3>
              <p className="text-foreground/80 font-medium text-sm truncate">
                {lastRead.surahName} - {t("audio.verse")} {lastRead.verseNumber}
              </p>
              <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                <Clock className="w-3 h-3" />
                <span>{formatDate(lastRead.timestamp)}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2 self-start md:self-center">
            <Button asChild size="sm" className="text-xs md:text-sm">
              <Link href={`/surah/${lastRead.surahNumber}#verse-${lastRead.verseNumber}`}>
                {t("home.continue_reading")}
              </Link>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleClearBookmark}
              className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-background/50 rounded-lg"
              title="Hapus penanda"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

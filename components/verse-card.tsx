"use client"

import { useState } from "react"
import { BookOpen, Bookmark, BookmarkCheck, Heart, HeartHandshake, ImageDown, PlayCircle, PauseCircle, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import type { Verse, SavedVerse } from "@/lib/types"
import { saveLastRead, getLastRead, saveSavedVerse, isVerseSaved, removeSavedVerse } from "@/lib/storage"
import { useSettings } from "@/hooks/use-settings"
import { useLanguage } from "@/hooks/use-language"
import { useAudio } from "@/hooks/use-audio"
import { TafsirModal } from "./tafsir-modal"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { cn, cleanVerseText } from "@/lib/utils"

interface VerseCardProps {
  verse: Verse
  surahNumber: number
  surahName: string
  tafsir?: string
  totalVerses?: number
}

export function VerseCard({ verse, surahNumber, surahName, tafsir, totalVerses = 0 }: VerseCardProps) {
  const [showTafsirModal, setShowTafsirModal] = useState(false)
  const [isLastRead, setIsLastRead] = useState(false)
  const [isSaved, setIsSaved] = useState(false)
  
  const { settings } = useSettings()
  const { language, t } = useLanguage()
  const { toast } = useToast()
  
  // Global Audio Context hooks
  const { status, currentSurah, currentVerse, playVerse, pause, resume } = useAudio()
  
  const isThisVerseAudioActive = currentSurah === surahNumber && currentVerse === verse.number
  const isPlaying = isThisVerseAudioActive && status === "playing"
  const isLoadingAudio = isThisVerseAudioActive && status === "loading"

  const toggleAudio = () => {
    if (isThisVerseAudioActive) {
      if (status === "playing") {
        pause()
      } else if (status === "paused") {
        resume()
      }
    } else {
      playVerse({
        surahNumber,
        verseNumber: verse.number,
        surahName,
        totalVerses
      })
    }
  }

  useState(() => {
    const lastRead = getLastRead()
    if (lastRead && lastRead.surahNumber === surahNumber && lastRead.verseNumber === verse.number) {
      setIsLastRead(true)
    }
    setIsSaved(isVerseSaved(surahNumber, verse.number))
  })

  const handleLastReadBookmark = () => {
    saveLastRead({
      surahNumber,
      verseNumber: verse.number,
      surahName,
      timestamp: Date.now(),
    })

    setIsLastRead(true)

    toast({
      title: t("toast.bookmark_saved"),
      description: `${surahName} ${t("audio.verse").toLowerCase()} ${verse.number} ${t("toast.bookmark_description")}`,
      duration: 3000,
    })

    setTimeout(() => {
      const currentLastRead = getLastRead()
      if (
        currentLastRead &&
        currentLastRead.surahNumber === surahNumber &&
        currentLastRead.verseNumber === verse.number
      ) {
        return
      }
      setIsLastRead(false)
    }, 3000)
  }

  const handleSaveVerse = () => {
    const verseId = `${surahNumber}-${verse.number}`
    const translation = language === "en" ? verse.translation_en : verse.translation_id

    if (isSaved) {
      removeSavedVerse(verseId)
      setIsSaved(false)
      toast({
        title: t("toast.verse_removed"),
        description: `${surahName} ${t("audio.verse").toLowerCase()} ${verse.number} ${t("toast.removed_description")}`,
        duration: 3000,
      })
    } else {
      const savedVerse: SavedVerse = {
        id: verseId,
        surahNumber,
        verseNumber: verse.number,
        surahName,
        verseText: verse.text,
        translation,
        timestamp: Date.now(),
      }

      saveSavedVerse(savedVerse)
      setIsSaved(true)
      toast({
        title: t("toast.verse_saved"),
        description: `${surahName} ${t("audio.verse").toLowerCase()} ${verse.number} ${t("toast.saved_description")}`,
        duration: 3000,
      })
    }
  }

  const openTafsirModal = () => {
    setShowTafsirModal(true)
  }

  const closeTafsirModal = () => {
    setShowTafsirModal(false)
  }

  const translation = language === "en" ? verse.translation_en : verse.translation_id

  const getVerseText = () => {
    return cleanVerseText(verse.text, verse.number, surahNumber)
  }

  const exportVerseImage = async (ext: "png" | "jpg") => {
    try {
      await (document as any).fonts?.ready

      const SIZE = 1080
      const canvas = document.createElement("canvas")
      canvas.width = SIZE
      canvas.height = SIZE
      const ctx = canvas.getContext("2d")
      if (!ctx) return

      // Premium Dark Theme Palette
      const gradient = ctx.createRadialGradient(SIZE / 2, SIZE / 2, 100, SIZE / 2, SIZE / 2, SIZE)
      gradient.addColorStop(0, "#1e293b") // slate-800
      gradient.addColorStop(1, "#0f172a") // slate-900

      // Background
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, SIZE, SIZE)

      // Decorative Circles (Watermark Motif)
      ctx.strokeStyle = "rgba(255, 255, 255, 0.04)"
      ctx.lineWidth = 1.5
      for (let i = 0; i < 6; i++) {
        ctx.beginPath()
        ctx.arc(SIZE / 2, SIZE / 2, 280 + i * 70, 0, Math.PI * 2)
        ctx.stroke()
      }

      // Elegant Gold Bars
      const accentGrad = ctx.createLinearGradient(0, 0, SIZE, 0)
      accentGrad.addColorStop(0, "#ca8a04") // yellow-600
      accentGrad.addColorStop(0.5, "#fef08a") // yellow-200
      accentGrad.addColorStop(1, "#ca8a04")

      ctx.fillStyle = accentGrad
      ctx.fillRect(0, 0, SIZE, 8)
      ctx.fillRect(0, SIZE - 8, SIZE, 8)

      // Thin inner border
      ctx.strokeStyle = "rgba(234, 179, 8, 0.2)"
      ctx.lineWidth = 2
      ctx.strokeRect(30, 38, SIZE - 60, SIZE - 76)

      // Content area with padding
      const pad = 64
      const contentW = SIZE - pad * 2

      // Arabic text (right-to-left, centered)
      ctx.fillStyle = "#ffffff"
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"
      ctx.direction = "rtl" as CanvasDirection

      ctx.shadowColor = "rgba(0, 0, 0, 0.5)"
      ctx.shadowBlur = 10
      ctx.shadowOffsetY = 4

      const arabicSize = 48
      ctx.font = `700 ${arabicSize}px "Amiri", "Scheherazade New", "Noto Naskh Arabic", serif`

      const arabicY = SIZE / 2 - 130
      const arabicLines = getVerseText().split(" ")
      let arabicLine = ""
      const arabicWrapped: string[] = []
      for (const word of arabicLines) {
        const test = arabicLine ? arabicLine + " " + word : word
        const { width } = ctx.measureText(test)
        if (width > contentW * 0.9 && arabicLine) {
          arabicWrapped.push(arabicLine)
          arabicLine = word
        } else {
          arabicLine = test
        }
      }
      if (arabicLine) arabicWrapped.push(arabicLine)

      const lineHeightArabic = arabicWrapped.length > 3 ? 60 : 72
      let currentY = arabicY - ((arabicWrapped.length - 1) * lineHeightArabic) / 2
      for (const line of arabicWrapped) {
        ctx.fillText(line, SIZE / 2, currentY)
        currentY += lineHeightArabic
      }

      ctx.shadowColor = "transparent"

      // Translation (left-to-right)
      ctx.textAlign = "center"
      ctx.direction = "ltr" as CanvasDirection
      ctx.fillStyle = "rgba(255, 255, 255, 0.85)"
      const translationSize = 17
      ctx.font = `400 ${translationSize}px "Inter", system-ui, sans-serif`

      const transLines = translation.split(" ")
      let transLine = ""
      const transWrapped: string[] = []
      for (const word of transLines) {
        const test = transLine ? transLine + " " + word : word
        const { width } = ctx.measureText(test)
        if (width > contentW * 0.95 && transLine) {
          transWrapped.push(transLine)
          transLine = word
        } else {
          transLine = test
        }
      }
      if (transLine) transWrapped.push(transLine)

      let transY = currentY + 40
      const lineHeightTranslation = 28
      for (const line of transWrapped) {
        ctx.fillText(line, SIZE / 2, transY)
        transY += lineHeightTranslation
      }

      // Surah and verse information
      ctx.fillStyle = "#eab308" // Gold color
      ctx.font = "600 15px Inter, system-ui, sans-serif"
      ;(ctx as any).letterSpacing = "2px"
      
      const infoLabel =
        language === "id"
          ? `${surahName.toUpperCase()} • AYAT ${verse.number}`
          : `${surahName.toUpperCase()} • VERSE ${verse.number}`
      
      ctx.fillText(infoLabel, SIZE / 2, transY + 36)
      ;(ctx as any).letterSpacing = "0px" // Reset

      // App Watermark / URL
      const url = "Al-Quran Digital · mysimplequran.vercel.app"
      ctx.fillStyle = "rgba(255, 255, 255, 0.3)"
      ctx.font = "500 13px Inter, system-ui, sans-serif"
      ctx.fillText(url, SIZE / 2, SIZE - pad + 10)

      const mime = ext === "png" ? "image/png" : "image/jpeg"
      const quality = ext === "jpg" ? 0.92 : undefined
      const dataUrl = canvas.toDataURL(mime, quality as any)
      const link = document.createElement("a")
      link.href = dataUrl
      link.download = `${surahName.replace(/\s+/g, "-").toLowerCase()}-${verse.number}-1x1.${ext}`
      link.click()
    } catch (e) {
      console.error("[v0] exportVerseImage error", e)
      toast({
        title: t("toast.error") || "Error",
        description: t("toast.try_again") || "Please try again",
        duration: 3000,
      })
    }
  }

  return (
    <>
      <div id={`verse-${verse.number}`} className="verse-card scroll-mt-20 relative group hover:bg-muted/5 transition-colors rounded-3xl p-6 md:p-8 border border-transparent hover:border-border/40">
        <div className="flex flex-col gap-6">
          {/* Header Verse: Number Only */}
          <div className="flex items-start justify-between">
            <div className="verse-number-wrapper !mb-0">
              <div className="verse-number text-primary">
                {verse.number}
              </div>
            </div>
          </div>

          {/* Arabic Text */}
          <div className="w-full pt-2">
            <p
              className="font-arabic text-foreground mb-4 text-right"
              dir="rtl"
              style={{
                fontSize: `${settings.arabicFontSize}px`,
                lineHeight: 2.2,
              }}
            >
              {getVerseText()}
            </p>
          </div>

          {/* Translation */}
          {settings.showTranslation && (
            <div className="w-full max-w-2xl bg-muted/20 p-4 rounded-2xl border border-border/20">
              <p
                className="text-muted-foreground leading-relaxed font-medium"
                style={{
                  fontSize: `${settings.translationFontSize}px`,
                }}
              >
                {translation}
              </p>
            </div>
          )}

          {/* Divider & Action Bar */}
          <div className="mt-4 pt-4 border-t border-border/30 flex items-center justify-between gap-4">
             {/* Main Audio Action */}
             <Button
                variant="default"
                size="sm"
                onClick={toggleAudio}
                className={`rounded-full px-5 shadow-sm transition-all ${isPlaying || isLoadingAudio ? "bg-primary/90" : "bg-muted text-foreground hover:bg-primary hover:text-primary-foreground"}`}
                title={isPlaying ? "Hentikan Murottal" : "Putar Murottal"}
              >
                {isLoadingAudio ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : isPlaying ? (
                  <PauseCircle className="w-4 h-4 mr-2" />
                ) : (
                  <PlayCircle className="w-4 h-4 mr-2" />
                )}
                {isPlaying ? "Jeda" : "Putar"}
              </Button>

            {/* Secondary Actions */}
            <div className="flex items-center gap-1 md:gap-2 opacity-60 group-hover:opacity-100 transition-opacity flex-wrap justify-end">
              {tafsir && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={openTafsirModal}
                  className="h-10 w-10 rounded-full hover:bg-primary/10 hover:text-primary"
                  title={t("verse.tafsir")}
                >
                  <BookOpen className="w-4 h-4" />
                </Button>
              )}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full hover:bg-primary/10 hover:text-primary" title={t("verse.export") || "Export"}>
                    <ImageDown className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-40 rounded-2xl border-border/40 shadow-xl">
                  <DropdownMenuItem onClick={() => exportVerseImage("png")} className="cursor-pointer rounded-xl m-1">
                    PNG Image (1:1)
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => exportVerseImage("jpg")} className="cursor-pointer rounded-xl m-1">
                    JPG Image (1:1)
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleSaveVerse}
                className={`h-10 w-10 rounded-full transition-colors ${isSaved ? "text-rose-500 bg-rose-50/50 hover:bg-rose-100/50" : "hover:text-rose-500 hover:bg-rose-50"}`}
                title={isSaved ? t("verse.unsave") : t("verse.save")}
              >
                {isSaved ? <HeartHandshake className="w-4 h-4" /> : <Heart className="w-4 h-4" />}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleLastReadBookmark}
                className={`h-10 w-10 rounded-full transition-colors ${isLastRead ? "text-primary bg-primary/10 hover:bg-primary/20" : "hover:text-primary hover:bg-primary/5"}`}
                title={t("verse.bookmark")}
              >
                {isLastRead ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {tafsir && (
        <TafsirModal
          isOpen={showTafsirModal}
          onClose={closeTafsirModal}
          verseNumber={verse.number}
          surahName={surahName}
          verseText={getVerseText()}
          tafsir={tafsir}
        />
      )}
    </>
  )
}

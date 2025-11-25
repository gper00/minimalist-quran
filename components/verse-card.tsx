"use client"

import { useState } from "react"
import { BookOpen, Bookmark, BookmarkCheck, Heart, HeartHandshake, ImageDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import type { Verse, SavedVerse } from "@/lib/types"
import { saveLastRead, getLastRead, saveSavedVerse, isVerseSaved, removeSavedVerse } from "@/lib/storage"
import { useSettings } from "@/hooks/use-settings"
import { useLanguage } from "@/hooks/use-language"
import { TafsirModal } from "./tafsir-modal"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface VerseCardProps {
  verse: Verse
  surahNumber: number
  surahName: string
  tafsir?: string
}

export function VerseCard({ verse, surahNumber, surahName, tafsir }: VerseCardProps) {
  const [showTafsirModal, setShowTafsirModal] = useState(false)
  const [isLastRead, setIsLastRead] = useState(false)
  const [isSaved, setIsSaved] = useState(false)
  const { settings } = useSettings()
  const { language, t } = useLanguage()
  const { toast } = useToast()

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

  const exportVerseImage = async (ext: "png" | "jpg") => {
    try {
      await (document as any).fonts?.ready

      const SIZE = 1080
      const canvas = document.createElement("canvas")
      canvas.width = SIZE
      canvas.height = SIZE
      const ctx = canvas.getContext("2d")
      if (!ctx) return

      // Minimal color palette
      const bg = "#ffffff"
      const accent = "#2563eb"
      const textDark = "#1f2937"
      const textLight = "#9ca3af"
      const textLightFaded = "#d1d5db"

      // Background
      ctx.fillStyle = bg
      ctx.fillRect(0, 0, SIZE, SIZE)

      // Top accent bar
      ctx.fillStyle = accent
      ctx.fillRect(0, 0, SIZE, 8)

      // Content area with padding
      const pad = 48
      const contentW = SIZE - pad * 2

      // Arabic text (right-to-left, centered)
      ctx.fillStyle = textDark
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"
      ctx.direction = "rtl" as CanvasDirection

      const arabicSize = 42
      // Using Amiri font for better Arabic rendering without boxes
      ctx.font = `700 ${arabicSize}px "Amiri", "Scheherazade New", "Noto Naskh Arabic", serif`

      const arabicY = SIZE / 2 - 140
      const arabicLines = verse.text.split(" ")
      let arabicLine = ""
      const arabicWrapped: string[] = []
      for (const word of arabicLines) {
        const test = arabicLine ? arabicLine + " " + word : word
        const { width } = ctx.measureText(test)
        if (width > contentW * 0.85 && arabicLine) {
          arabicWrapped.push(arabicLine)
          arabicLine = word
        } else {
          arabicLine = test
        }
      }
      if (arabicLine) arabicWrapped.push(arabicLine)

      let currentY = arabicY - (arabicWrapped.length - 1) * 28
      for (const line of arabicWrapped) {
        ctx.fillText(line, SIZE / 2, currentY)
        currentY += 56
      }

      // Translation (left-to-right)
      ctx.textAlign = "center"
      ctx.direction = "ltr" as CanvasDirection
      ctx.fillStyle = textLight
      const translationSize = 16
      ctx.font = `400 ${translationSize}px "Open Sans", system-ui`

      const transLines = translation.split(" ")
      let transLine = ""
      const transWrapped: string[] = []
      for (const word of transLines) {
        const test = transLine ? transLine + " " + word : word
        const { width } = ctx.measureText(test)
        if (width > contentW * 0.9 && transLine) {
          transWrapped.push(transLine)
          transLine = word
        } else {
          transLine = test
        }
      }
      if (transLine) transWrapped.push(transLine)

      let transY = SIZE / 2 + 80
      for (const line of transWrapped) {
        ctx.fillText(line, SIZE / 2, transY)
        transY += 26
      }

      // Surah and verse information
      ctx.fillStyle = textLightFaded
      ctx.font = "400 14px Open Sans, system-ui"
      const infoLabel =
        language === "id"
          ? `${t("verse.surah_label")} ${surahName} • ${t("verse.verse_label")} ${verse.number}`
          : `${t("verse.surah_label")} ${surahName} • ${t("verse.verse_label")} ${verse.number}`
      ctx.fillText(infoLabel, SIZE / 2, SIZE / 2 + 140)

      // URL and transparency
      const url = "https://mysimplequran.vercel.app/"
      ctx.fillStyle = "rgba(156, 163, 175, 0.6)"
      ctx.font = "400 12px Open Sans, system-ui"
      ctx.fillText(url, SIZE / 2, SIZE - pad + 16)

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
      <Card id={`verse-${verse.number}`} className="scroll-mt-20">
        <CardContent className="p-4 sm:p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="verse-number">{verse.number}</div>
            <div className="flex items-center space-x-2">
              {tafsir && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={openTafsirModal}
                  className="h-8 w-8"
                  title={t("verse.tafsir")}
                >
                  <BookOpen className="w-4 h-4" />
                </Button>
              )}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8" title={t("verse.export") || "Export"}>
                    <ImageDown className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-32">
                  <DropdownMenuItem onClick={() => exportVerseImage("png")}>PNG (1:1)</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => exportVerseImage("jpg")}>JPG (1:1)</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleSaveVerse}
                className={`h-8 w-8 ${isSaved ? "text-red-500" : ""}`}
                title={isSaved ? t("verse.unsave") : t("verse.save")}
              >
                {isSaved ? <HeartHandshake className="w-4 h-4" /> : <Heart className="w-4 h-4" />}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleLastReadBookmark}
                className={`h-8 w-8 ${isLastRead ? "text-blue-600" : ""}`}
                title={t("verse.bookmark")}
              >
                {isLastRead ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            <div className="text-right">
              <p
                className="font-arabic leading-loose text-gray-900"
                style={{
                  fontSize: `${settings.arabicFontSize}px`,
                  lineHeight: 1.8,
                }}
              >
                {verse.text}
              </p>
            </div>

            <div className="text-left">
              <p
                className="leading-relaxed text-gray-600"
                style={{
                  fontSize: `${settings.translationFontSize}px`,
                  lineHeight: 1.6,
                }}
              >
                {translation}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {tafsir && (
        <TafsirModal
          isOpen={showTafsirModal}
          onClose={closeTafsirModal}
          verseNumber={verse.number}
          surahName={surahName}
          verseText={verse.text}
          tafsir={tafsir}
        />
      )}
    </>
  )
}

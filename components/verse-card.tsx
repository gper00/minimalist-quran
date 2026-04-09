"use client"

import { useState, useRef, useEffect } from "react"
import { BookOpen, Bookmark, BookmarkCheck, Heart, HeartHandshake, ImageDown, PlayCircle, PauseCircle, Loader2 } from "lucide-react"
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

  const [isPlaying, setIsPlaying] = useState(false)
  const [isLoadingAudio, setIsLoadingAudio] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
    }
  }, [])

  const toggleAudio = () => {
    if (isPlaying) {
      if (audioRef.current) audioRef.current.pause()
      setIsPlaying(false)
    } else {
      if (!audioRef.current) {
        setIsLoadingAudio(true)
        const surahStr = String(surahNumber).padStart(3, '0')
        const verseStr = String(verse.number).padStart(3, '0')
        const audioUrl = `https://everyayah.com/data/Alafasy_128kbps/${surahStr}${verseStr}.mp3`
        audioRef.current = new Audio(audioUrl)
        
        audioRef.current.onended = () => {
          setIsPlaying(false)
        }
        audioRef.current.onerror = () => {
          setIsPlaying(false)
          setIsLoadingAudio(false)
          toast({
            title: "Error",
            description: "Gagal memuat audio murottal.",
            duration: 3000,
          })
        }
        audioRef.current.oncanplay = () => {
          setIsLoadingAudio(false)
        }
      }
      
      const playPromise = audioRef.current.play()
      if (playPromise !== undefined) {
        playPromise.then(() => {
          setIsPlaying(true)
        }).catch(err => {
          console.error("Audio playback error:", err)
          setIsPlaying(false)
          setIsLoadingAudio(false)
        })
      }
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
    let text = verse.text
    if (verse.number === 1 && surahNumber !== 1 && surahNumber !== 9) {
      // Robust Bismillah removal using Regex to handle variations in spacing/harakat
      const bismillahRegex = /^بِسْمِ\s+ٱللَّهِ\s+ٱلرَّحْمَٰنِ\s+ٱلرَّحِيمِ\s*/
      text = text.replace(bismillahRegex, "").trim()
    }
    return text
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
      ctx.font = `700 ${arabicSize}px "Amiri", "Scheherazade New", "Noto Naskh Arabic", serif`

      const arabicY = SIZE / 2 - 140
      const arabicLines = getVerseText().split(" ")
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

      const lineHeightArabic = arabicWrapped.length > 3 ? 48 : 56
      let currentY = arabicY - (arabicWrapped.length - 1) * (lineHeightArabic / 2)
      for (const line of arabicWrapped) {
        ctx.fillText(line, SIZE / 2, currentY)
        currentY += lineHeightArabic
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

      let transY = currentY + 32
      const lineHeightTranslation = 24
      for (const line of transWrapped) {
        ctx.fillText(line, SIZE / 2, transY)
        transY += lineHeightTranslation
      }

      // Surah and verse information
      ctx.fillStyle = textLightFaded
      ctx.font = "400 14px Open Sans, system-ui"
      const infoLabel =
        language === "id"
          ? `${t("verse.surah_label")} ${surahName} • ${t("verse.verse_label")} ${verse.number}`
          : `${t("verse.surah_label")} ${surahName} • ${t("verse.verse_label")} ${verse.number}`
      ctx.fillText(infoLabel, SIZE / 2, transY + 24)

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
      <div id={`verse-${verse.number}`} className="verse-card scroll-mt-20">
        <div className="flex flex-col gap-8">
          {/* Header Verse: Number and Actions */}
          <div className="flex items-center justify-between">
            <div className="verse-number-wrapper">
              <div className="verse-number text-primary/80">
                {verse.number}
              </div>
            </div>
            
            <div className="flex items-center gap-1 opacity-60 hover:opacity-100 transition-opacity">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleAudio}
                className={`h-9 w-9 rounded-full ${isPlaying || isLoadingAudio ? "text-primary bg-primary/10" : ""}`}
                title={isPlaying ? "Hentikan Murottal" : "Putar Murottal"}
              >
                {isLoadingAudio ? (
                  <Loader2 className="w-4.5 h-4.5 animate-spin" />
                ) : isPlaying ? (
                  <PauseCircle className="w-4.5 h-4.5" />
                ) : (
                  <PlayCircle className="w-4.5 h-4.5" />
                )}
              </Button>
              {tafsir && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={openTafsirModal}
                  className="h-9 w-9 rounded-full"
                  title={t("verse.tafsir")}
                >
                  <BookOpen className="w-4.5 h-4.5" />
                </Button>
              )}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full" title={t("verse.export") || "Export"}>
                    <ImageDown className="w-4.5 h-4.5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-40">
                  <DropdownMenuItem onClick={() => exportVerseImage("png")} className="cursor-pointer">
                    PNG Image (1:1)
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => exportVerseImage("jpg")} className="cursor-pointer">
                    JPG Image (1:1)
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleSaveVerse}
                className={`h-9 w-9 rounded-full ${isSaved ? "text-rose-500 bg-rose-50/50" : ""}`}
                title={isSaved ? t("verse.unsave") : t("verse.save")}
              >
                {isSaved ? <HeartHandshake className="w-4.5 h-4.5" /> : <Heart className="w-4.5 h-4.5" />}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleLastReadBookmark}
                className={`h-9 w-9 rounded-full ${isLastRead ? "text-primary bg-primary/10" : ""}`}
                title={t("verse.bookmark")}
              >
                {isLastRead ? <BookmarkCheck className="w-4.5 h-4.5" /> : <Bookmark className="w-4.5 h-4.5" />}
              </Button>
            </div>
          </div>

          {/* Arabic Text */}
          <div className="w-full">
            <p
              className="font-arabic text-foreground mb-6"
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
            <div className="w-full max-w-2xl">
              <p
                className="text-muted-foreground leading-relaxed font-medium"
                style={{
                  fontSize: `${settings.translationFontSize}px`,
                }}
              >
                <span className="text-primary/40 mr-2 font-bold">{verse.number}</span>
                {translation}
              </p>
            </div>
          )}
        </div>
      </div>

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

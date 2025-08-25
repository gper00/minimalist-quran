"use client"

import { useState } from "react"
import { BookOpen, Bookmark, BookmarkCheck, Heart, HeartHandshake } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import type { Verse, SavedVerse } from "@/lib/types"
import { saveLastRead, getLastRead, saveSavedVerse, isVerseSaved, removeSavedVerse } from "@/lib/storage"
import { useSettings } from "@/hooks/use-settings"
import { useLanguage } from "@/hooks/use-language"
import { TafsirModal } from "./tafsir-modal"

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
    // Save this verse as last read
    saveLastRead({
      surahNumber,
      verseNumber: verse.number,
      surahName,
      timestamp: Date.now(),
    })

    setIsLastRead(true)

    // Show success toast
    toast({
      title: t("toast.bookmark_saved"),
      description: `${surahName} ${t("audio.verse").toLowerCase()} ${verse.number} ${t("toast.bookmark_description")}`,
      duration: 3000,
    })

    // Auto-remove bookmark visual after 3 seconds
    setTimeout(() => {
      const currentLastRead = getLastRead()
      if (
        currentLastRead &&
        currentLastRead.surahNumber === surahNumber &&
        currentLastRead.verseNumber === verse.number
      ) {
        // Keep it bookmarked if it's still the current last read
        return
      }
      setIsLastRead(false)
    }, 3000)
  }

  const handleSaveVerse = () => {
    const verseId = `${surahNumber}-${verse.number}`
    const translation = language === "en" ? verse.translation_en : verse.translation_id

    if (isSaved) {
      // Remove from saved verses
      removeSavedVerse(verseId)
      setIsSaved(false)
      toast({
        title: t("toast.verse_removed"),
        description: `${surahName} ${t("audio.verse").toLowerCase()} ${verse.number} ${t("toast.removed_description")}`,
        duration: 3000,
      })
    } else {
      // Add to saved verses
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

  return (
    <>
      <Card id={`verse-${verse.number}`} className="scroll-mt-20">
        <CardContent className="p-6">
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
                className={`h-8 w-8 ${isLastRead ? "text-primary" : ""}`}
                title={t("verse.bookmark")}
              >
                {isLastRead ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            {/* Arabic Text with dynamic font size */}
            <div className="text-right">
              <p
                className="font-arabic leading-loose text-foreground"
                style={{
                  fontSize: `${settings.arabicFontSize}px`,
                  lineHeight: 1.8,
                }}
              >
                {verse.text}
              </p>
            </div>

            {/* Translation with dynamic font size and language support */}
            <div className="text-left">
              <p
                className="leading-relaxed text-muted-foreground"
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

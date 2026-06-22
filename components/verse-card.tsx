"use client"

import { useState, useEffect } from "react"
import { BookOpen, Bookmark, BookmarkCheck, Heart, HeartHandshake, PlayCircle, PauseCircle, Loader2, Share2, Check, ImageDown, MoreVertical } from "lucide-react"
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
import { formatVerseForShare, shareToWhatsApp, shareToTwitter, shareToFacebook, copyToClipboard } from "@/lib/share"
import { ARABIC_FONTS, LATIN_FONTS } from "@/lib/fonts"
import { ShareDialog } from "@/components/share"
import type { AyahShareData } from "@/types/share"

interface VerseCardProps {
  verse: Verse
  surahNumber: number
  surahName: string
  surahNameAr?: string
  tafsir?: string
  totalVerses?: number
}

export function VerseCard({ verse, surahNumber, surahName, surahNameAr, tafsir, totalVerses = 0 }: VerseCardProps) {
  const [showTafsirModal, setShowTafsirModal] = useState(false)
  const [isLastRead, setIsLastRead] = useState(false)
  const [isSaved, setIsSaved] = useState(false)
  const [shareOpen, setShareOpen] = useState(false)
  
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

  useEffect(() => {
    const lastRead = getLastRead()
    if (lastRead && lastRead.surahNumber === surahNumber && lastRead.verseNumber === verse.number) {
      setIsLastRead(true)
    }
    setIsSaved(isVerseSaved(surahNumber, verse.number))
  }, [surahNumber, verse.number])

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

  const shareData: AyahShareData = {
    surahName,
    surahNameAr: surahNameAr || "",
    surahNumber,
    ayahNumber: verse.number,
    arabicText: getVerseText(),
    translation,
  }

  const handleShare = (platform: "whatsapp" | "twitter" | "facebook" | "copy") => {
    const shareText = formatVerseForShare(getVerseText(), translation, surahName, verse.number)
    
    switch (platform) {
      case "whatsapp":
        shareToWhatsApp(shareText)
        break
      case "twitter":
        shareToTwitter(shareText)
        break
      case "facebook":
        shareToFacebook(shareText)
        break
      case "copy":
        copyToClipboard(shareText).then((success) => {
          toast({
            title: success ? "Berhasil Disalin" : "Gagal Menyalin",
            description: success ? "Ayat telah disalin ke clipboard" : "Terjadi kesalahan, coba lagi",
            duration: 2000,
          })
        })
        break
    }
  }



  return (
    <>
      <div id={`verse-${verse.number}`} className="verse-card scroll-mt-20 relative group px-2 md:px-8 py-6">
        <div className="flex flex-col gap-6">
          {/* Header Verse: Number & Actions */}
          <div className="flex items-center justify-between">
            <div className="verse-number-wrapper !mb-0">
              <div className="verse-number text-primary">
                {verse.number}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 md:gap-4">
              {/* Main Audio Action */}
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleAudio}
                className={`h-10 w-10 rounded-full transition-colors ${isPlaying || isLoadingAudio ? "text-primary bg-primary/10 hover:bg-primary/20" : "hover:text-primary hover:bg-primary/5"}`}
                title={isPlaying ? "Hentikan Murottal" : "Putar Murottal"}
              >
                {isLoadingAudio ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : isPlaying ? (
                  <PauseCircle className="w-4 h-4" fill="currentColor" />
                ) : (
                  <PlayCircle className="w-4 h-4" />
                )}
              </Button>

              {/* Secondary Actions - Desktop */}
              <div className="hidden md:flex items-center gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
                {tafsir && (
                  <Button variant="ghost" size="icon" onClick={openTafsirModal} className="rounded-full hover:text-primary" title={t("verse.tafsir")}>
                    <BookOpen className="w-4 h-4" />
                  </Button>
                )}
                <Button variant="ghost" size="icon" onClick={() => setShareOpen(true)} className="rounded-full hover:text-primary" title="Export Gambar">
                  <ImageDown className="w-4 h-4" />
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="rounded-full hover:text-primary" title="Share">
                      <Share2 className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48 rounded-2xl">
                    <DropdownMenuItem onClick={() => handleShare("whatsapp")} className="cursor-pointer">WhatsApp</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleShare("twitter")} className="cursor-pointer">Twitter / X</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleShare("facebook")} className="cursor-pointer">Facebook</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleShare("copy")} className="cursor-pointer">Salin Teks</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <Button variant="ghost" size="icon" onClick={handleSaveVerse} className={`rounded-full ${isSaved ? "text-rose-500" : "hover:text-rose-500"}`} title={isSaved ? t("verse.unsave") : t("verse.save")}>
                  {isSaved ? <HeartHandshake className="w-4 h-4" /> : <Heart className="w-4 h-4" />}
                </Button>
                <Button variant="ghost" size="icon" onClick={handleLastReadBookmark} className={`rounded-full ${isLastRead ? "text-primary" : "hover:text-primary"}`} title={t("verse.bookmark")}>
                  {isLastRead ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
                </Button>
              </div>

              {/* Secondary Actions - Mobile Kebab */}
              <div className="md:hidden flex items-center opacity-80 group-hover:opacity-100">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="rounded-full h-8 w-8">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48 rounded-xl">
                    {tafsir && (
                      <DropdownMenuItem onClick={openTafsirModal} className="cursor-pointer gap-2 py-3">
                        <BookOpen className="w-4 h-4" /> Tafsir Kemenag
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem onClick={() => setShareOpen(true)} className="cursor-pointer gap-2 py-3">
                      <ImageDown className="w-4 h-4" /> Export Gambar
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleShare("copy")} className="cursor-pointer gap-2 py-3">
                      <Share2 className="w-4 h-4" /> Bagikan Teks
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleSaveVerse} className={`cursor-pointer gap-2 py-3 ${isSaved ? "text-rose-500" : ""}`}>
                      {isSaved ? <HeartHandshake className="w-4 h-4" /> : <Heart className="w-4 h-4" />} 
                      {isSaved ? "Hapus Simpanan" : "Simpan Ayat"}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleLastReadBookmark} className={`cursor-pointer gap-2 py-3 ${isLastRead ? "text-primary" : ""}`}>
                      {isLastRead ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
                      {isLastRead ? "Terakhir Dibaca" : "Tandai Bacaan"}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
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
              }}
            >
              {getVerseText()}
            </p>
          </div>

          {/* Translation */}
          {settings.showTranslation && (
            <div className="w-full max-w-2xl mt-4">
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


        </div>
        <hr className="mt-8 border-border/20" />
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

      <ShareDialog
        open={shareOpen}
        onOpenChange={setShareOpen}
        data={shareData}
      />
    </>
  )
}

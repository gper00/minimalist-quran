"use client"

import { useState, useEffect } from "react"
import { Heart, Trash2, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card, CardContent } from "@/components/ui/card"
import { useLanguage } from "@/hooks/use-language"
import { getSavedVerses, removeSavedVerse } from "@/lib/storage"
import type { SavedVerse } from "@/lib/types"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"
import { cleanVerseText } from "@/lib/utils"

interface SavedVersesModalProps {
  isOpen: boolean
  onClose: () => void
}

export function SavedVersesModal({ isOpen, onClose }: SavedVersesModalProps) {
  const [savedVerses, setSavedVerses] = useState<SavedVerse[]>([])
  const { language, t } = useLanguage()
  const { toast } = useToast()

  useEffect(() => {
    if (isOpen) {
      setSavedVerses(getSavedVerses())
    }
  }, [isOpen])

  const handleRemoveVerse = (verseId: string) => {
    removeSavedVerse(verseId)
    setSavedVerses((prev) => prev.filter((v) => v.id !== verseId))
    toast({
      title: t("toast.verse_removed"),
      description: t("toast.removed_description"),
      duration: 3000,
    })
  }

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString(language === "en" ? "en-US" : "id-ID", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl w-[95vw] rounded-3xl p-0 overflow-hidden border border-border/40 bg-background/95 backdrop-blur-xl shadow-2xl">
        <div className="sticky top-0 z-10 px-8 py-6 pb-4 bg-background/80 backdrop-blur-xl border-b border-border/30">
          <DialogHeader className="space-y-1.5 text-left">
            <DialogTitle className="flex items-center space-x-3 text-2xl font-bold tracking-tight text-foreground">
              <div className="w-10 h-10 rounded-full bg-rose-500/10 flex items-center justify-center">
                <Heart className="w-5 h-5 text-rose-500 fill-rose-500/20" />
              </div>
              <span>{t("saved_verses.title")}</span>
            </DialogTitle>
            <DialogDescription className="text-sm font-medium text-muted-foreground/80 pl-1">
              {savedVerses.length > 0 ? t("saved_verses.description") : t("saved_verses.empty_description")}
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="px-8 py-6 pb-12 space-y-6 max-h-[60vh] overflow-y-auto hidden-scrollbar">
          {savedVerses.length === 0 ? (
            <div className="text-center py-16 bg-muted/20 rounded-3xl border-2 border-dashed border-border/50">
              <Heart className="w-14 h-14 text-muted-foreground/30 mx-auto mb-4" />
              <p className="text-muted-foreground font-medium text-lg">{t("saved_verses.no_verses")}</p>
              <p className="text-sm text-muted-foreground mt-2 opacity-70">{t("saved_verses.start_saving")}</p>
            </div>
          ) : (
            savedVerses.map((verse) => (
              <Card key={verse.id} className="border-0 bg-muted/30 shadow-none hover:shadow-lg hover:shadow-primary/5 hover:bg-muted/50 rounded-2xl transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4 pb-4 border-b border-border/30">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-1">
                        <h3 className="font-bold text-foreground text-lg tracking-tight">
                          {verse.surahName} <span className="text-primary/40 mx-1">•</span> {t("audio.verse")} {verse.verseNumber}
                        </h3>
                        <Link href={`/surah/${verse.surahNumber}#verse-${verse.verseNumber}`}>
                          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full bg-primary/5 hover:bg-primary/10 text-primary transition-colors">
                            <ExternalLink className="w-4 h-4" />
                          </Button>
                        </Link>
                      </div>
                      <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                        {t("saved_verses.saved_on")} {formatDate(verse.timestamp)}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveVerse(verse.id)}
                      className="h-10 w-10 rounded-xl text-rose-500/70 hover:text-rose-600 hover:bg-rose-50 shadow-sm transition-colors"
                      title="Hapus ayat"
                    >
                      <Trash2 className="w-4.5 h-4.5" />
                    </Button>
                  </div>

                  <div className="space-y-4">
                    <div className="text-right">
                      <p className="font-arabic text-2xl leading-relaxed text-foreground">{cleanVerseText(verse.verseText, verse.verseNumber, verse.surahNumber)}</p>
                    </div>
                    <div className="text-left bg-background/50 p-4 rounded-xl">
                      <p className="text-sm leading-relaxed font-medium text-muted-foreground">{verse.translation}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

"use client"

import { useState, useEffect } from "react"
import { Heart, Trash2, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card, CardContent } from "@/components/ui/card"
import { useLanguage } from "@/hooks/use-language"
import { getSavedVerses, removeSavedVerse, type SavedVerse } from "@/lib/storage"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

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
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2 text-lg">
            <Heart className="w-5 h-5 text-red-500" />
            <span>{t("saved_verses.title")}</span>
          </DialogTitle>
          <DialogDescription>
            {savedVerses.length > 0 ? t("saved_verses.description") : t("saved_verses.empty_description")}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {savedVerses.length === 0 ? (
            <div className="text-center py-8">
              <Heart className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">{t("saved_verses.no_verses")}</p>
              <p className="text-sm text-muted-foreground mt-2">{t("saved_verses.start_saving")}</p>
            </div>
          ) : (
            savedVerses.map((verse) => (
              <Card key={verse.id} className="border border-border/60">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="font-semibold text-foreground">
                          {verse.surahName} - {t("audio.verse")} {verse.verseNumber}
                        </h3>
                        <Link href={`/surah/${verse.surahNumber}#verse-${verse.verseNumber}`}>
                          <Button variant="ghost" size="icon" className="h-6 w-6">
                            <ExternalLink className="w-3 h-3" />
                          </Button>
                        </Link>
                      </div>
                      <p className="text-xs text-muted-foreground mb-3">
                        {t("saved_verses.saved_on")} {formatDate(verse.timestamp)}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveVerse(verse.id)}
                      className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="space-y-3">
                    <div className="text-right">
                      <p className="font-arabic text-lg leading-loose text-foreground">{verse.verseText}</p>
                    </div>
                    <div className="text-left">
                      <p className="text-sm leading-relaxed text-muted-foreground">{verse.translation}</p>
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

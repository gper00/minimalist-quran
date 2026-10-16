"use client"

import { useState, useEffect } from "react"
import { Bookmark, Trash2, ExternalLink, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
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
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent
        side="right"
        showCloseButton={false}
        className="w-[92vw] max-w-lg rounded-l-3xl p-0 overflow-hidden border-border/40 glass-strong shadow-2xl sm:w-full sm:max-w-xl lg:max-w-3xl xl:max-w-4xl"
      >
        <div className="flex flex-1 min-h-0 flex-col">
          {/* Header */}
          <div className="flex-none glass border-b border-border/30 px-5 py-4 sm:px-8 sm:py-6">
            <div className="flex items-start justify-between gap-3">
              <SheetHeader className="space-y-1.5 text-left">
                <SheetTitle className="flex items-center gap-3 text-2xl font-bold tracking-tight text-foreground">
                  <span className="w-10 h-10 rounded-full bg-brand/10 text-brand flex items-center justify-center">
                    <Bookmark className="w-5 h-5" />
                  </span>
                  <span>{t("saved_verses.title")}</span>
                </SheetTitle>
                <SheetDescription className="text-sm font-medium text-muted-foreground/80">
                  {savedVerses.length > 0 ? t("saved_verses.description") : t("saved_verses.empty_description")}
                </SheetDescription>
              </SheetHeader>
              <SheetClose asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 flex-none rounded-xl text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                  aria-label={t("settings.cancel")}
                >
                  <X className="h-4 w-4" />
                </Button>
              </SheetClose>
            </div>
          </div>

          {/* Scrollable list */}
          <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden px-4 py-4 space-y-4 custom-scrollbar sm:px-8 sm:py-6 sm:space-y-5">
            {savedVerses.length === 0 ? (
              <div className="text-center py-16 bg-muted/20 rounded-3xl border-2 border-dashed border-border/50">
                <Bookmark className="w-14 h-14 text-muted-foreground/30 mx-auto mb-4" />
                <p className="text-muted-foreground font-medium text-lg">{t("saved_verses.no_verses")}</p>
                <p className="text-sm text-muted-foreground mt-2 opacity-70">{t("saved_verses.start_saving")}</p>
              </div>
            ) : (
              savedVerses.map((verse) => (
                <Card key={verse.id} className="border-0 bg-muted/30 shadow-none hover:shadow-lg hover:shadow-primary/5 hover:bg-muted/50 rounded-2xl transition-all duration-300">
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex items-start justify-between gap-3 mb-4 pb-4 border-b border-border/30">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-bold text-foreground text-lg tracking-tight truncate">
                            {verse.surahName} <span className="text-primary/40 mx-1">•</span> {t("audio.verse")} {verse.verseNumber}
                          </h3>
                          <Link href={`/surah/${verse.surahNumber}#verse-${verse.verseNumber}`} className="flex-none">
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
                        className="h-9 w-9 flex-none rounded-xl text-rose-500/70 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors"
                        title="Hapus ayat"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>

                    <div className="space-y-4">
                      <div className="text-right">
                        <p className="font-arabic text-2xl leading-loose text-foreground">{cleanVerseText(verse.verseText, verse.verseNumber, verse.surahNumber)}</p>
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
        </div>
      </SheetContent>
    </Sheet>
  )
}

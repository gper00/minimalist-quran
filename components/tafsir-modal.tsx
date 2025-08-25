"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useLanguage } from "@/hooks/use-language"

interface TafsirModalProps {
  isOpen: boolean
  onClose: () => void
  verseNumber: number
  surahName: string
  verseText: string
  tafsir: string
}

export function TafsirModal({ isOpen, onClose, verseNumber, surahName, verseText, tafsir }: TafsirModalProps) {
  const { t } = useLanguage()

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            {t("tafsir.title")} {surahName} {t("tafsir.verse")} {verseNumber}
          </DialogTitle>
          <DialogDescription asChild>
            <div className="space-y-4">
              {/* Arabic Verse */}
              <div className="p-4 bg-muted/30 rounded-lg border border-border/50">
                <p className="font-arabic text-xl leading-loose text-right text-foreground mb-3">{verseText}</p>
                <div className="text-center">
                  <span className="verse-number text-sm">{verseNumber}</span>
                </div>
              </div>
            </div>
          </DialogDescription>
        </DialogHeader>

        {/* Tafsir Content */}
        <div className="mt-6">
          <h3 className="font-semibold text-foreground mb-3 text-base">{t("tafsir.source")}:</h3>
          <div className="prose prose-sm max-w-none">
            <p className="text-foreground leading-relaxed whitespace-pre-wrap text-sm">{tafsir}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

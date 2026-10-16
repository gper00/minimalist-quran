"use client"

import { ChevronLeft, ChevronRight } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/hooks/use-language"

interface TafsirModalProps {
  isOpen: boolean
  onClose: () => void
  verseNumber: number
  surahName: string
  verseText: string
  tafsir: string
  hasPrev?: boolean
  hasNext?: boolean
  onPrev?: () => void
  onNext?: () => void
}

export function TafsirModal({
  isOpen,
  onClose,
  verseNumber,
  surahName,
  verseText,
  tafsir,
  hasPrev,
  hasNext,
  onPrev,
  onNext,
}: TafsirModalProps) {
  const { t } = useLanguage()
  const hasNav = onPrev !== undefined || onNext !== undefined

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[95vw] sm:max-w-5xl rounded-3xl p-0 overflow-hidden border border-border/40 glass-strong shadow-2xl">

        {/* Sticky Glass Header */}
        <div className="sticky top-0 z-10 flex items-start justify-between gap-3 border-b border-border/30 glass px-5 py-5 pb-4 sm:px-8 sm:py-6">
          <DialogHeader className="space-y-1.5 text-left">
            <DialogTitle className="text-lg font-bold tracking-tight text-foreground sm:text-2xl">
              {t("tafsir.title")} {surahName} <span className="text-primary/50 mx-1">•</span> {t("tafsir.verse")} {verseNumber}
            </DialogTitle>
            <DialogDescription className="text-xs font-medium text-muted-foreground/80 sm:text-sm">
              Disadur dari basis data tafsir Kemenag RI
            </DialogDescription>
          </DialogHeader>

          {hasNav && (
            <div className="flex shrink-0 items-center gap-1 pr-7 sm:pr-8">
              <Button
                variant="outline"
                size="icon"
                onClick={onPrev}
                disabled={!hasPrev}
                className="h-8 w-8 rounded-full"
                title="Ayat sebelumnya"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={onNext}
                disabled={!hasNext}
                className="h-8 w-8 rounded-full"
                title="Ayat selanjutnya"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>

        {/* Scrollable Content Area */}
        <div className="px-5 py-5 pb-10 space-y-6 max-h-[70vh] overflow-y-auto hidden-scrollbar sm:px-8 sm:py-6 sm:pb-12 sm:space-y-8 sm:max-h-[60vh]">

          {/* Highlighted Arabic Verse */}
          <div className="p-5 bg-muted/40 rounded-2xl border border-border/30 shadow-inner sm:p-6">
            <p className="font-arabic text-xl leading-relaxed text-right text-foreground mb-4 sm:text-2xl" dir="rtl">{verseText}</p>
            <div className="flex items-center justify-center gap-2">
              <div className="h-px flex-1 bg-border/30" />
              <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold text-sm">
                {verseNumber}
              </span>
              <div className="h-px flex-1 bg-border/30" />
            </div>
          </div>

          {/* Detailed Tafsir Content */}
          <div className="space-y-4">
            <h3 className="flex items-center gap-2 font-bold text-foreground text-sm uppercase tracking-widest text-muted-foreground">
              <span className="w-6 h-px bg-border/50"></span>
              Isi {t("tafsir.source")}
              <span className="flex-1 h-px bg-border/50"></span>
            </h3>
            <div className="prose prose-sm max-w-none">
              <p className="text-foreground/90 leading-[1.8] font-medium whitespace-pre-wrap text-[15px]">
                {tafsir || "Tafsir untuk ayat ini tidak tersedia."}
              </p>
            </div>
          </div>

        </div>
      </DialogContent>
    </Dialog>
  )
}

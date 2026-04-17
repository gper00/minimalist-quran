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
      <DialogContent className="max-w-4xl w-[95vw] rounded-3xl p-0 overflow-hidden border border-border/40 bg-background/95 backdrop-blur-xl shadow-2xl">
        
        {/* Sticky Glass Header */}
        <div className="sticky top-0 z-10 px-8 py-6 pb-4 bg-background/80 backdrop-blur-xl border-b border-border/30">
          <DialogHeader className="space-y-1.5 text-left">
            <DialogTitle className="text-2xl font-bold tracking-tight text-foreground">
              {t("tafsir.title")} {surahName} <span className="text-primary/50 mx-1">•</span> {t("tafsir.verse")} {verseNumber}
            </DialogTitle>
            <DialogDescription className="text-sm font-medium text-muted-foreground/80">
              Disadur dari basis data tafsir Kemenag RI
            </DialogDescription>
          </DialogHeader>
        </div>

        {/* Scrollable Content Area */}
        <div className="px-8 py-6 pb-12 space-y-8 max-h-[60vh] overflow-y-auto hidden-scrollbar">
          
          {/* Highlighted Arabic Verse */}
          <div className="p-6 bg-muted/40 rounded-2xl border border-border/30 shadow-inner">
            <p className="font-arabic text-2xl leading-relaxed text-right text-foreground mb-4">{verseText}</p>
            <div className="text-center">
              <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold text-sm">
                {verseNumber}
              </span>
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
              <p className="text-foreground/90 leading-[1.8] font-medium whitespace-pre-wrap text-[15px]">{tafsir}</p>
            </div>
          </div>

        </div>
      </DialogContent>
    </Dialog>
  )
}

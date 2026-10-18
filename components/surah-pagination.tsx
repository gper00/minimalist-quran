"use client"

import Link from "next/link"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useLanguage } from "@/hooks/use-language"

interface SurahPaginationProps {
  previousSurah: number | null
  nextSurah: number | null
}

export function SurahPagination({ previousSurah, nextSurah }: SurahPaginationProps) {
  const { t } = useLanguage()

  return (
    <div className="mt-12 flex items-center justify-between gap-4 border-t border-border/10 pt-8">
      {previousSurah ? (
        <Link href={`/surah/${previousSurah}`} className="flex-1 group">
          <div className="p-3 rounded-xl border border-border/50 hover:bg-muted/50 transition-all group-active:scale-[0.98]">
            <div className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-0.5">
              <ChevronLeft className="h-3 w-3" />
              {t("common.previous")}
            </div>
            <div className="text-sm font-bold truncate group-hover:text-primary transition-colors">
              Surah {previousSurah}
            </div>
          </div>
        </Link>
      ) : (
        <div className="flex-1" />
      )}

      {nextSurah ? (
        <Link href={`/surah/${nextSurah}`} className="flex-1 group text-right">
          <div className="p-3 rounded-xl border border-border/50 hover:bg-muted/50 transition-all group-active:scale-[0.98]">
            <div className="flex items-center justify-end gap-1 text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-0.5">
              {t("common.next")}
              <ChevronRight className="h-3 w-3" />
            </div>
            <div className="text-sm font-bold truncate group-hover:text-primary transition-colors">
              Surah {nextSurah}
            </div>
          </div>
        </Link>
      ) : (
        <div className="flex-1" />
      )}
    </div>
  )
}

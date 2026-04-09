"use client"

import Link from "next/link"
import type { JuzInfo } from "@/lib/juz"

interface JuzCardProps {
  juz: JuzInfo
  mode?: "grid" | "list"
}

export function JuzCard({ juz, mode = "grid" }: JuzCardProps) {
  const url = `/surah/${juz.start.surah}#verse-${juz.start.verse}`

  if (mode === "list") {
    return (
      <Link href={url} className="group block">
        <div className="flex items-center justify-between p-4 rounded-xl border border-border/50 hover:bg-primary/5 hover:border-primary/20 transition-all duration-300">
          <div className="flex items-center gap-4">
            <span className="text-sm font-bold text-muted-foreground w-6">{juz.number}</span>
            <div className="flex flex-col">
              <span className="font-bold text-foreground group-hover:text-primary transition-colors">Juz {juz.number}</span>
              <span className="text-xs text-muted-foreground font-medium">
                Mulai: {juz.start.surahName} Ayat {juz.start.verse}
              </span>
            </div>
          </div>
        </div>
      </Link>
    )
  }

  return (
    <Link href={url} className="group block">
      <div className="relative h-full p-6 rounded-2xl border border-border/60 bg-card hover:bg-primary/[0.02] hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 overflow-hidden flex flex-col justify-between min-h-[140px]">
        {/* Background Number Ornament */}
        <div className="absolute -top-4 -right-4 w-24 h-24 bg-primary/5 rounded-full flex items-center justify-center blur-2xl group-hover:bg-primary/10 transition-colors" />
        
        <div className="relative z-10 flex flex-col gap-2">
          <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-lg mb-2">
            {juz.number}
          </div>
          <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors tracking-tight">
            Juz {juz.number}
          </h3>
        </div>

        <div className="relative z-10 pt-4 border-t border-border/10">
          <p className="text-sm text-muted-foreground font-medium flex justify-between">
            <span>Mulai</span>
            <span className="text-foreground">{juz.start.surahName} : {juz.start.verse}</span>
          </p>
        </div>
      </div>
    </Link>
  )
}

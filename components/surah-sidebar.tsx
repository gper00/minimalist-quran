"use client"

import { useState, useMemo, useEffect } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { Search, X, LayoutGrid } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/hooks/use-language"
import type { Surah } from "@/lib/types"

interface SurahSidebarProps {
  surahs: Surah[]
}

export function SurahSidebar({ surahs }: SurahSidebarProps) {
  const params = useParams()
  const currentSurahNumber = Number(params.number)
  const { language, t } = useLanguage()
  const [searchQuery, setSearchQuery] = useState("")

  const getSurahMeaning = (surah: Surah) =>
    language === "en" ? surah.name_translations.en : surah.name_translations.id

  const filteredSurahs = useMemo(() => {
    const query = searchQuery.toLowerCase().trim()
    if (!query) return surahs
    return surahs.filter(s => 
      s.name.toLowerCase().includes(query) || 
      s.number_of_surah.toString() === query ||
      s.name_translations.id.toLowerCase().includes(query) ||
      s.name_translations.en.toLowerCase().includes(query)
    )
  }, [surahs, searchQuery])

  useEffect(() => {
    if (currentSurahNumber) {
      const activeEl = document.getElementById(`sidebar-surah-${currentSurahNumber}`);
      if (activeEl) {
        setTimeout(() => {
          activeEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 100);
      }
    }
  }, [currentSurahNumber]);

  return (
    <div className="flex flex-col h-full glass border-r border-border/10">
      {/* Integrated Search Box */}
      <div className="px-3 py-3 border-b border-border/10">
        <div className="relative group">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground/50 transition-colors group-focus-within:text-primary" />
          <Input
            type="text"
            placeholder={t("search.placeholder")}
            className="pl-9 bg-muted/50 border border-border/50 focus-visible:ring-primary/20"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Sidebar Content */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <div className="p-2 space-y-0.5">
          {filteredSurahs.map((surah) => {
            const isActive = surah.number_of_surah === currentSurahNumber
            return (
              <Link
                key={surah.number_of_surah}
                id={`sidebar-surah-${surah.number_of_surah}`}
                href={`/surah/${surah.number_of_surah}`}
                prefetch={false}
                className={`
                  flex items-center justify-between py-2.5 px-3 rounded-lg transition-all duration-200 group no-underline
                  ${isActive 
                    ? "bg-primary/10 text-primary shadow-sm" 
                    : "hover:bg-muted/50 text-foreground/70 hover:text-foreground"}
                `}
              >
                <div className="flex items-center gap-3">
                  <span className={`
                    text-[10px] font-bold w-6 h-6 flex items-center justify-center rounded-md
                    ${isActive ? "bg-primary text-primary-foreground shadow-sm" : "bg-muted text-muted-foreground/80"}
                  `}>
                    {surah.number_of_surah}
                  </span>
                  <div className="flex flex-col">
                    <span className="text-sm font-bold leading-tight">{surah.name}</span>
                    <span className={`text-[9px] font-medium uppercase tracking-wider ${isActive ? "text-primary/70" : "text-muted-foreground"}`}>
                      {getSurahMeaning(surah)}
                    </span>
                  </div>
                </div>
                <span className={`font-arabic text-lg ${isActive ? "text-primary" : "text-foreground/40 group-hover:text-foreground/60"}`}>
                  {surah.name_translations.ar}
                </span>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}

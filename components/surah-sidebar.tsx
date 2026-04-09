"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { Search, X, LayoutGrid } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import type { Surah } from "@/lib/types"

interface SurahSidebarProps {
  surahs: Surah[]
}

export function SurahSidebar({ surahs }: SurahSidebarProps) {
  const params = useParams()
  const currentSurahNumber = Number(params.number)
  const [searchQuery, setSearchQuery] = useState("")

  const filteredSurahs = useMemo(() => {
    const query = searchQuery.toLowerCase().trim()
    if (!query) return surahs
    return surahs.filter(s => 
      s.name.toLowerCase().includes(query) || 
      s.number_of_surah.toString() === query ||
      s.name_translations.id.toLowerCase().includes(query)
    )
  }, [surahs, searchQuery])

  return (
    <div className="flex flex-col h-full bg-background border-r border-border/10">
      {/* Integrated Search Box - Clean Style */}
      <div className="p-5 border-b border-border/10">
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/50 transition-colors group-focus-within:text-primary" />
          <input
            type="text"
            placeholder="Cari surah..."
            className="w-full pl-9 pr-8 bg-muted/20 border-none h-10 rounded-xl focus:bg-muted/40 outline-none text-sm transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Sidebar Content */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <div className="p-3 space-y-1">
          {filteredSurahs.map((surah) => {
            const isActive = surah.number_of_surah === currentSurahNumber
            return (
              <Link
                key={surah.number_of_surah}
                href={`/surah/${surah.number_of_surah}`}
                className={`
                  flex items-center justify-between p-3 rounded-xl transition-all duration-200 group no-underline
                  ${isActive 
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" 
                    : "hover:bg-muted/50 text-foreground/70 hover:text-foreground"}
                `}
              >
                <div className="flex items-center gap-3">
                  <span className={`
                    text-xs font-bold w-6 h-6 flex items-center justify-center rounded-md
                    ${isActive ? "bg-white/20" : "bg-muted text-muted-foreground"}
                  `}>
                    {surah.number_of_surah}
                  </span>
                  <div className="flex flex-col">
                    <span className="text-sm font-bold leading-tight">{surah.name}</span>
                    <span className={`text-[10px] font-medium uppercase tracking-wider ${isActive ? "text-white/70" : "text-muted-foreground"}`}>
                      {surah.name_translations.id}
                    </span>
                  </div>
                </div>
                <span className={`font-arabic text-lg ${isActive ? "text-white" : "text-foreground/40"}`}>
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

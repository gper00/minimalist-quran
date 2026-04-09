"use client"

import { useState, useMemo } from "react"
import { SurahCard } from "./surah-card"
import { SearchBar } from "./search-bar"
import { useLanguage } from "@/hooks/use-language"
import { LayoutGrid, List } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Surah } from "@/lib/types"

interface SurahListProps {
  surahs: Surah[]
}

export function SurahList({ surahs }: SurahListProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const { language, t } = useLanguage()

  const filteredSurahs = useMemo(() => {
    const query = searchQuery.toLowerCase().trim()
    if (!query) return surahs

    return surahs.filter((surah) => 
      surah.number_of_surah.toString().includes(query) ||
      surah.name.toLowerCase().includes(query) ||
      surah.name_translations.id.toLowerCase().includes(query) ||
      (surah.name_translations.en && surah.name_translations.en.toLowerCase().includes(query)) ||
      surah.name_translations.ar.includes(query)
    )
  }, [surahs, searchQuery])

  return (
    <div className="space-y-12">
      {/* Centered Search Bar */}
      <div className="max-w-2xl mx-auto -mt-4 mb-8">
        <SearchBar onSearch={setSearchQuery} />
      </div>

      <div className="space-y-6">
        {/* Toolbar: Results & Toggle */}
        <div className="flex items-center justify-between border-b border-border/10 pb-4">
          <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
            {searchQuery ? `${t("search.results")} (${filteredSurahs.length})` : `Daftar Surah (${surahs.length})`}
          </h2>
          
          <div className="flex items-center gap-1 bg-muted/50 p-1 rounded-lg">
            <Button
              variant={viewMode === "grid" ? "secondary" : "ghost"}
              size="icon"
              onClick={() => setViewMode("grid")}
              className="h-8 w-8 rounded-md"
            >
              <LayoutGrid className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "secondary" : "ghost"}
              size="icon"
              onClick={() => setViewMode("list")}
              className="h-8 w-8 rounded-md"
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Surah List/Grid Container */}
        {filteredSurahs.length > 0 ? (
          <div className={`
            grid gap-4 transition-all duration-300
            ${viewMode === "grid" ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1 max-w-3xl mx-auto"}
          `}>
            {filteredSurahs.map((surah) => (
              <SurahCard key={surah.number_of_surah} surah={surah} mode={viewMode} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-muted/20 rounded-3xl border-2 border-dashed border-border/50">
            <div className="text-muted-foreground text-xl font-medium mb-2">{t("search.no_results")}</div>
            <p className="text-sm text-muted-foreground opacity-70">{t("search.try_different")}</p>
          </div>
        )}
      </div>
    </div>
  )
}

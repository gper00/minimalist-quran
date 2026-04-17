"use client"

import { useState, useMemo } from "react"
import { SurahCard } from "./surah-card"
import { JuzCard } from "./juz-card"
import { SearchBar } from "./search-bar"
import { VerseSearchResults } from "./verse-search-results"
import { useLanguage } from "@/hooks/use-language"
import { LayoutGrid, List, Book, Layers } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Surah } from "@/lib/types"
import { JUZ_DATA } from "@/lib/juz"

interface SurahListProps {
  surahs: Surah[]
}

export function SurahList({ surahs }: SurahListProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [activeTab, setActiveTab] = useState<"surah" | "juz">("surah")
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

  const filteredJuz = useMemo(() => {
    const query = searchQuery.toLowerCase().trim()
    if (!query) return JUZ_DATA

    return JUZ_DATA.filter((juz) =>
      juz.number.toString().includes(query) ||
      (juz.number === parseInt(query))
    )
  }, [searchQuery])

  return (
    <div className="space-y-6">
      {/* Unified Toolbar: Tabs + Search + View Toggle */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border/10 pb-4">
        {/* Left: Tabs */}
        <div className="bg-muted p-1 rounded-xl flex items-center gap-1 shadow-inner border border-border/30 shrink-0">
          <button
            onClick={() => setActiveTab("surah")}
            className={`flex items-center gap-1.5 py-2 px-4 rounded-lg text-xs font-bold transition-all duration-200 ${activeTab === "surah" ? "bg-background text-primary shadow-sm ring-1 ring-border/50" : "text-muted-foreground hover:text-foreground"}`}
          >
            <Book className="w-3.5 h-3.5" />
            Surah
          </button>
          <button
            onClick={() => setActiveTab("juz")}
            className={`flex items-center gap-1.5 py-2 px-4 rounded-lg text-xs font-bold transition-all duration-200 ${activeTab === "juz" ? "bg-background text-primary shadow-sm ring-1 ring-border/50" : "text-muted-foreground hover:text-foreground"}`}
          >
            <Layers className="w-3.5 h-3.5" />
            Juz
          </button>
        </div>

        {/* Right: Search + View Toggle */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <SearchBar
            className="flex-1 sm:w-56"
            onSearch={setSearchQuery}
            placeholder={activeTab === "surah" ? "Cari surah..." : "Cari juz..."}
          />

          <div className="flex items-center gap-1 bg-muted/50 p-1 rounded-xl shrink-0">
            <Button
              variant={viewMode === "grid" ? "secondary" : "ghost"}
              size="icon"
              onClick={() => setViewMode("grid")}
              className="h-8 w-8 rounded-lg"
              title="Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "secondary" : "ghost"}
              size="icon"
              onClick={() => setViewMode("list")}
              className="h-8 w-8 rounded-lg"
              title="List View"
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

        {/* Content Container */}
        {activeTab === "surah" ? (
          filteredSurahs.length > 0 ? (
            <div className="space-y-12">
              <div className={`
                grid gap-4 transition-all duration-300
                ${viewMode === "grid" ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1 max-w-3xl mx-auto"}
              `}>
                {filteredSurahs.map((surah) => (
                  <SurahCard key={surah.number_of_surah} surah={surah} mode={viewMode} />
                ))}
              </div>
              {searchQuery.trim().length >= 3 && (
                <div className="max-w-3xl mx-auto pt-6 border-t border-border/20">
                  <VerseSearchResults query={searchQuery} />
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-12">
              <div className="text-center py-20 bg-muted/20 rounded-3xl border-2 border-dashed border-border/50">
                <div className="text-muted-foreground text-xl font-medium mb-2">{t("search.no_results")}</div>
                <p className="text-sm text-muted-foreground opacity-70">{t("search.try_different")}</p>
              </div>
              {searchQuery.trim().length >= 3 && (
                <div className="max-w-3xl mx-auto pt-6 border-t border-border/20">
                  <VerseSearchResults query={searchQuery} />
                </div>
              )}
            </div>
          )
        ) : (
          filteredJuz.length > 0 ? (
            <div className={`
              grid gap-4 transition-all duration-300
              ${viewMode === "grid" ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1 max-w-3xl mx-auto"}
            `}>
              {filteredJuz.map((juz) => (
                <JuzCard key={juz.number} juz={juz} mode={viewMode} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-muted/20 rounded-3xl border-2 border-dashed border-border/50">
              <div className="text-muted-foreground text-xl font-medium mb-2">{t("search.no_results")}</div>
              <p className="text-sm text-muted-foreground opacity-70">{t("search.try_different")}</p>
            </div>
          )
        )}
    </div>
  )
}

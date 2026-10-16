"use client"

import { useState, useMemo } from "react"
import { SurahCard } from "./surah-card"
import { JuzCard } from "./juz-card"
import { SearchBar } from "./search-bar"
import { VerseSearchResults } from "./verse-search-results"
import { useLanguage } from "@/hooks/use-language"
import { useIsMobile } from "@/hooks/use-mobile"
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
  const isMobile = useIsMobile()

  // Mobile always uses the compact list layout (the grid shows a single column)
  const effectiveMode: "grid" | "list" = isMobile ? "list" : viewMode

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
      {/* Unified Toolbar: Tabs + Search + View Toggle (sticky on mobile) */}
      <div className="sticky top-0 z-30 -mx-3 mb-3 flex flex-col gap-2.5 border-b border-border/10 glass px-3 py-2.5 sm:flex-row sm:items-center sm:justify-between sm:gap-4 md:static md:mx-0 md:mb-0 md:border-b-0 md:bg-transparent md:px-0 md:py-0 md:pb-4 md:backdrop-blur-none">
        {/* Tabs: full-width segmented control on mobile, inline on larger screens */}
        <div className="grid w-full shrink-0 grid-cols-2 gap-1 rounded-xl border border-border/30 bg-muted p-1 shadow-inner sm:flex sm:w-auto sm:items-center">
          <button
            type="button"
            onClick={() => setActiveTab("surah")}
            aria-pressed={activeTab === "surah"}
            className={`flex items-center justify-center gap-1.5 rounded-lg px-4 py-2.5 text-xs font-bold transition-all duration-200 sm:py-2 ${activeTab === "surah" ? "bg-brand/10 text-brand ring-1 ring-inset ring-brand/25" : "text-muted-foreground hover:text-foreground"}`}
          >
            <Book className="w-3.5 h-3.5" />
            {t("nav.surah")}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("juz")}
            aria-pressed={activeTab === "juz"}
            className={`flex items-center justify-center gap-1.5 rounded-lg px-4 py-2.5 text-xs font-bold transition-all duration-200 sm:py-2 ${activeTab === "juz" ? "bg-brand/10 text-brand ring-1 ring-inset ring-brand/25" : "text-muted-foreground hover:text-foreground"}`}
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

          {!isMobile && (
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
          )}
        </div>
      </div>

        {/* Content Container */}
        {activeTab === "surah" ? (
          filteredSurahs.length > 0 ? (
            <div className="space-y-12">
              <div className={`
                grid gap-4 transition-all duration-300
                ${effectiveMode === "grid" ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1 max-w-3xl mx-auto"}
              `}>
                {filteredSurahs.map((surah) => (
                  <SurahCard key={surah.number_of_surah} surah={surah} mode={effectiveMode} />
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
              ${effectiveMode === "grid" ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1 max-w-3xl mx-auto"}
            `}>
              {filteredJuz.map((juz) => (
                <JuzCard key={juz.number} juz={juz} mode={effectiveMode} />
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

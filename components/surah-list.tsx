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
    <div className="space-y-8">
      {/* Tabs */}
      <div className="flex justify-center mb-4">
        <div className="bg-muted p-1.5 rounded-2xl flex items-center gap-2 max-w-xs w-full shadow-inner border border-border/40">
          <button
            onClick={() => setActiveTab("surah")}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-bold transition-all duration-300 ${activeTab === "surah" ? "bg-background text-primary shadow-sm ring-1 ring-border/50 scale-100" : "text-muted-foreground hover:bg-background/50 hover:text-foreground scale-95 opacity-80"}`}
          >
            <Book className="w-4 h-4" />
            Surah
          </button>
          <button
            onClick={() => setActiveTab("juz")}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-bold transition-all duration-300 ${activeTab === "juz" ? "bg-background text-primary shadow-sm ring-1 ring-border/50 scale-100" : "text-muted-foreground hover:bg-background/50 hover:text-foreground scale-95 opacity-80"}`}
          >
            <Layers className="w-4 h-4" />
            Juz
          </button>
        </div>
      </div>

      <div className="space-y-6">
        {/* Toolbar: Results, Search & Toggle */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-border/10 pb-4 gap-4">
          <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground whitespace-nowrap">
            {activeTab === "surah"
              ? (searchQuery ? `${t("search.results")} (${filteredSurahs.length})` : `Daftar Surah (${surahs.length})`)
              : (searchQuery ? `${t("search.results")} (${filteredJuz.length})` : `Daftar Juz (30)`)
            }
          </h2>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <SearchBar
              className="flex-1 sm:w-64"
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
    </div>
  )
}

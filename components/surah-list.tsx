"use client"

import { useState, useMemo } from "react"
import { SurahCard } from "./surah-card"
import { SearchBar } from "./search-bar"
import { useLanguage } from "@/hooks/use-language"
import type { Surah } from "@/lib/types"

interface SurahListProps {
  surahs: Surah[]
}

export function SurahList({ surahs }: SurahListProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const { language, t } = useLanguage()

  const filteredSurahs = useMemo(() => {
    if (!searchQuery.trim()) {
      return surahs
    }

    const query = searchQuery.toLowerCase().trim()

    return surahs.filter((surah) => {
      // Search by surah number
      if (surah.number_of_surah.toString().includes(query)) {
        return true
      }

      // Search by English name
      if (surah.name.toLowerCase().includes(query)) {
        return true
      }

      // Search by Indonesian translation
      if (surah.name_translations.id.toLowerCase().includes(query)) {
        return true
      }

      // Search by English translation if available
      if (surah.name_translations.en && surah.name_translations.en.toLowerCase().includes(query)) {
        return true
      }

      // Search by Arabic name (transliterated search)
      if (surah.name_translations.ar.includes(query)) {
        return true
      }

      // Search by type (Makkiyah/Madaniyah)
      if (surah.type.toLowerCase().includes(query)) {
        return true
      }

      // Search by place
      if (surah.place.toLowerCase().includes(query)) {
        return true
      }

      return false
    })
  }, [surahs, searchQuery])

  const handleSearch = (query: string) => {
    setSearchQuery(query)
  }

  return (
    <div className="space-y-4">
      <SearchBar onSearch={handleSearch} />

      {/* Results Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-foreground">
          {searchQuery ? (
            <>
              {t("search.results")} "{searchQuery}" ({filteredSurahs.length})
            </>
          ) : (
            <>
              {t("home.surah_list")} ({surahs.length})
            </>
          )}
        </h2>
      </div>

      {/* Surah Cards */}
      {filteredSurahs.length > 0 ? (
        <div className="grid gap-3">
          {filteredSurahs.map((surah) => (
            <SurahCard key={surah.number_of_surah} surah={surah} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-muted-foreground text-lg mb-2">{t("search.no_results")}</div>
          <p className="text-sm text-muted-foreground">{t("search.try_different")}</p>
        </div>
      )}
    </div>
  )
}

"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Loader2, Search } from "lucide-react"
import { useLanguage } from "@/hooks/use-language"

interface VerseSearchResultsProps {
  query: string
}

interface Match {
  number: number
  text: string
  numberInSurah: number
  surah: {
    number: number
    name: string
    englishName: string
  }
}

export function VerseSearchResults({ query }: VerseSearchResultsProps) {
  const [results, setResults] = useState<Match[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)
  const { language } = useLanguage()

  useEffect(() => {
    const fetchResults = async () => {
      const q = query.trim()
      if (q.length < 3) {
        setResults([])
        setHasSearched(false)
        return
      }

      setLoading(true)
      setError(false)
      setHasSearched(true)
      
      try {
        const edition = language === "id" ? "id.indonesian" : "en.asad"
        const res = await fetch(`https://api.alquran.cloud/v1/search/${q}/all/${edition}`)
        const data = await res.json()
        
        if (data.code === 200 && data.data && data.data.matches) {
          // Limit to maximum 10 results to keep the UI clean
          setResults(data.data.matches.slice(0, 10))
        } else {
          setResults([])
        }
      } catch (err) {
        console.error("Search error:", err)
        setError(true)
        setResults([])
      } finally {
        setLoading(false)
      }
    }

    const debounceTimer = setTimeout(() => {
      fetchResults()
    }, 500)

    return () => clearTimeout(debounceTimer)
  }, [query, language])

  if (!hasSearched) return null

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-10 opacity-60">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
        <p className="text-sm">Mencari terjemahan ayat...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-6 text-rose-500">
        <p className="text-sm">Terjadi kesalahan jaringan saat mencari.</p>
      </div>
    )
  }

  if (results.length === 0) {
    return (
      <div className="text-center py-10 bg-muted/20 rounded-3xl border-2 border-dashed border-border/50">
        <Search className="h-8 w-8 text-muted-foreground/30 mx-auto mb-2" />
        <p className="text-muted-foreground font-medium">Tidak ada terjemahan ayat yang cocok dengan "{query}"</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold tracking-tight px-2 flex items-center gap-2">
        <Search className="w-5 h-5 text-primary" />
        Hasil Pencarian Terjemahan
      </h3>
      <div className="grid gap-3 grid-cols-1">
        {results.map((match) => (
          <Link 
            key={`${match.surah.number}-${match.numberInSurah}`} 
            href={`/surah/${match.surah.number}#verse-${match.numberInSurah}`}
            className="group"
          >
            <div className="p-4 rounded-xl border border-border/50 hover:bg-primary/[0.03] hover:border-primary/30 transition-all duration-300 relative overflow-hidden">
              <div className="flex justify-between items-start mb-2">
                <span className="text-xs font-bold bg-primary/10 text-primary px-2 py-1 rounded-md">
                  {match.surah.englishName} ({match.surah.number}:{match.numberInSurah})
                </span>
              </div>
              <p className="text-sm text-foreground/80 leading-relaxed font-medium line-clamp-3 group-hover:text-foreground">
                "{match.text}"
              </p>
            </div>
          </Link>
        ))}
      </div>
      <p className="text-center text-xs text-muted-foreground opacity-60 mt-4">
        Menampilkan maksimal 10 hasil pencarian.
      </p>
    </div>
  )
}

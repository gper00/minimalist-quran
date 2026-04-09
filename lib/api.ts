import { cache } from "react"
import type { Surah, SurahDetail } from "./types"

export const getAllSurahs = cache(async (): Promise<Surah[]> => {
  try {
    const response = await fetch("https://raw.githubusercontent.com/penggguna/QuranJSON/master/quran.json", {
      next: { revalidate: 3600 * 24 } // Cache for 24 hours
    })
    if (!response.ok) throw new Error("Failed to fetch surahs")
    return await response.json()
  } catch (error) {
    console.error("Error fetching surahs:", error)
    return []
  }
})

export const getSurahDetail = cache(async (surahNumber: number): Promise<SurahDetail | null> => {
  try {
    const response = await fetch(
      `https://raw.githubusercontent.com/penggguna/QuranJSON/master/surah/${surahNumber}.json`,
      { next: { revalidate: 3600 * 24 } } // Cache for 24 hours
    )
    if (!response.ok) throw new Error(`Failed to fetch surah ${surahNumber}`)
    return await response.json()
  } catch (error) {
    console.error(`Error fetching surah ${surahNumber}:`, error)
    return null
  }
})

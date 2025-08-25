import type { Surah, SurahDetail } from "./types"

export async function getAllSurahs(): Promise<Surah[]> {
  try {
    const response = await fetch("https://raw.githubusercontent.com/penggguna/QuranJSON/master/quran.json")
    if (!response.ok) {
      throw new Error("Failed to fetch surahs")
    }
    return await response.json()
  } catch (error) {
    console.error("Error fetching surahs:", error)
    return []
  }
}

export async function getSurahDetail(surahNumber: number): Promise<SurahDetail | null> {
  try {
    const response = await fetch(
      `https://raw.githubusercontent.com/penggguna/QuranJSON/master/surah/${surahNumber}.json`,
    )
    if (!response.ok) {
      throw new Error(`Failed to fetch surah ${surahNumber}`)
    }
    return await response.json()
  } catch (error) {
    console.error(`Error fetching surah ${surahNumber}:`, error)
    return null
  }
}

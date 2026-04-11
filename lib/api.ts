import fs from "fs/promises"
import path from "path"
import { cache } from "react"
import type { Surah, SurahDetail } from "./types"

export const getAllSurahs = cache(async (): Promise<Surah[]> => {
  try {
    const filePath = path.join(process.cwd(), "data", "quran.json")
    const fileData = await fs.readFile(filePath, "utf-8")
    return JSON.parse(fileData)
  } catch (error) {
    console.error("Error loading surahs:", error)
    return []
  }
})

export const getSurahDetail = cache(async (surahNumber: number): Promise<SurahDetail | null> => {
  try {
    const filePath = path.join(process.cwd(), "data", "surah", `${surahNumber}.json`)
    const fileData = await fs.readFile(filePath, "utf-8")
    return JSON.parse(fileData)
  } catch (error) {
    console.error(`Error loading surah ${surahNumber}:`, error)
    return null
  }
})

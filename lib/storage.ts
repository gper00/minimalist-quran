import type { LastRead, SavedVerse } from "./types"

const LAST_READ_KEY = "quran-last-read"
const SAVED_VERSES_KEY = "quran-saved-verses"

export function saveLastRead(lastRead: LastRead): void {
  if (typeof window !== "undefined") {
    localStorage.setItem(LAST_READ_KEY, JSON.stringify(lastRead))
  }
}

export function getLastRead(): LastRead | null {
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem(LAST_READ_KEY)
    if (stored) {
      try {
        return JSON.parse(stored)
      } catch (error) {
        console.error("Error parsing last read data:", error)
        localStorage.removeItem(LAST_READ_KEY)
      }
    }
  }
  return null
}

export function clearLastRead(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem(LAST_READ_KEY)
  }
}

export function saveSavedVerse(verse: SavedVerse): void {
  if (typeof window !== "undefined") {
    const existingVerses = getSavedVerses()
    const updatedVerses = existingVerses.filter((v) => v.id !== verse.id)
    updatedVerses.unshift(verse) // Add to beginning
    localStorage.setItem(SAVED_VERSES_KEY, JSON.stringify(updatedVerses))
  }
}

export function getSavedVerses(): SavedVerse[] {
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem(SAVED_VERSES_KEY)
    if (stored) {
      try {
        return JSON.parse(stored)
      } catch (error) {
        console.error("Error parsing saved verses data:", error)
        localStorage.removeItem(SAVED_VERSES_KEY)
      }
    }
  }
  return []
}

export function removeSavedVerse(verseId: string): void {
  if (typeof window !== "undefined") {
    const existingVerses = getSavedVerses()
    const updatedVerses = existingVerses.filter((v) => v.id !== verseId)
    localStorage.setItem(SAVED_VERSES_KEY, JSON.stringify(updatedVerses))
  }
}

export function isVerseSaved(surahNumber: number, verseNumber: number): boolean {
  const savedVerses = getSavedVerses()
  return savedVerses.some((v) => v.surahNumber === surahNumber && v.verseNumber === verseNumber)
}

export function clearAllSavedVerses(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem(SAVED_VERSES_KEY)
  }
}

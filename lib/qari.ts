// Qari (Reciter) Configuration
// Each qari has a unique URL pattern for audio files

export interface Qari {
  id: string
  name: string
  url: string // Base URL for audio files
  style?: string // Recitation style
}

export const QARIS: Qari[] = [
  {
    id: "alafasy",
    name: "Mishary Rashid Alafasy",
    url: "https://everyayah.com/data/Alafasy_128kbps/",
    style: "Murattal"
  },
]

export const DEFAULT_QARI_ID = "alafasy"

export function getQariById(id: string): Qari {
  return QARIS.find(q => q.id === id) || QARIS[0]
}

export function getQariUrl(qariId: string, surahNumber: number, verseNumber: number): string {
  const qari = getQariById(qariId)
  const surahStr = String(surahNumber).padStart(3, '0')
  const verseStr = String(verseNumber).padStart(3, '0')
  return `${qari.url}${surahStr}${verseStr}.mp3`
}

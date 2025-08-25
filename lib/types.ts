export interface Surah {
  name: string
  name_translations: {
    ar: string
    id: string
    en: string
  }
  number_of_ayah: number
  number_of_surah: number
  place: string
  type: string
}

export interface Verse {
  number: number
  text: string
  translation_id: string
  translation_en: string
}

export interface Recitation {
  name: string
  audio_url: string
}

export interface SurahDetail {
  name: string
  name_translations: {
    ar: string
    id: string
    en: string
  }
  number_of_surah: number
  place: string
  type: string
  verses: Verse[]
  recitations: Recitation[]
  tafsir: {
    id: {
      kemenag: {
        text: {
          [key: string]: string
        }
      }
    }
  }
}

export interface LastRead {
  surahNumber: number
  verseNumber: number
  surahName: string
  timestamp: number
}

export interface SavedVerse {
  id: string
  surahNumber: number
  verseNumber: number
  surahName: string
  verseText: string
  translation: string
  timestamp: number
  note?: string
}

export type Language = "id" | "en"

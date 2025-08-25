"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

type Language = "id" | "en"

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const translations = {
  id: {
    // Header
    "app.title": "Al-Quran Digital",
    "header.settings": "Pengaturan",
    "header.theme": "Ubah tema",

    // Homepage
    "home.continue_reading": "Lanjutkan Membaca",
    "home.last_read": "Terakhir dibaca",
    "home.verses": "ayat",
    "home.makkiyah": "Makkiyah",
    "home.madaniyah": "Madaniyah",
    "home.surah_list": "Daftar Surah",

    // Surah Detail
    "surah.verses": "ayat",
    "surah.play_all": "Putar Semua",
    "surah.stop": "Berhenti",
    "surah.back": "Kembali",
    "surah.bismillah": "Dengan menyebut nama Allah Yang Maha Pemurah lagi Maha Penyayang.",

    // Verse Actions
    "verse.play": "Putar ayat",
    "verse.tafsir": "Lihat Tafsir",
    "verse.bookmark": "Tandai sebagai terakhir dibaca",
    "verse.save": "Simpan ayat",
    "verse.unsave": "Hapus dari simpanan",

    // Settings
    "settings.title": "Pengaturan",
    "settings.description": "Sesuaikan tampilan aplikasi sesuai preferensi Anda",
    "settings.theme": "Tema",
    "settings.language": "Bahasa",
    "settings.typography": "Tipografi",
    "settings.arabic_font_size": "Ukuran Font Arab",
    "settings.translation_font_size": "Ukuran Font Terjemahan",
    "settings.light": "Terang",
    "settings.dark": "Gelap",
    "settings.system": "Sistem",
    "settings.indonesian": "Bahasa Indonesia",
    "settings.english": "English",
    "settings.reset": "Reset",
    "settings.cancel": "Batal",
    "settings.save": "Simpan",

    // Tafsir
    "tafsir.title": "Tafsir",
    "tafsir.verse": "Ayat",
    "tafsir.source": "Tafsir Kementerian Agama",

    // Toast Messages
    "toast.bookmark_saved": "Penanda Tersimpan",
    "toast.bookmark_description": "telah ditandai sebagai terakhir dibaca.",
    "toast.verse_saved": "Ayat Tersimpan",
    "toast.saved_description": "telah disimpan ke koleksi Anda.",
    "toast.verse_removed": "Ayat Dihapus",
    "toast.removed_description": "telah dihapus dari koleksi Anda.",

    // Search
    "search.placeholder": "Cari surah...",
    "search.no_results": "Tidak ada hasil ditemukan",
    "search.results": "Hasil pencarian",
    "search.try_different": "Coba kata kunci yang berbeda",

    // Audio
    "audio.verse": "Ayat",

    // Saved Verses
    "saved_verses.title": "Ayat Tersimpan",
    "saved_verses.description": "Kumpulan ayat yang telah Anda simpan untuk dibaca kembali",
    "saved_verses.empty_description": "Belum ada ayat yang disimpan",
    "saved_verses.no_verses": "Belum ada ayat tersimpan",
    "saved_verses.start_saving": "Mulai simpan ayat favorit Anda dengan menekan tombol hati",
    "saved_verses.saved_on": "Disimpan pada",
  },
  en: {
    // Header
    "app.title": "Digital Quran",
    "header.settings": "Settings",
    "header.theme": "Toggle theme",

    // Homepage
    "home.continue_reading": "Continue Reading",
    "home.last_read": "Last read",
    "home.verses": "verses",
    "home.makkiyah": "Meccan",
    "home.madaniyah": "Medinan",
    "home.surah_list": "Surah List",

    // Surah Detail
    "surah.verses": "verses",
    "surah.play_all": "Play All",
    "surah.stop": "Stop",
    "surah.back": "Back",
    "surah.bismillah": "In the name of Allah, the Entirely Merciful, the Especially Merciful.",

    // Verse Actions
    "verse.play": "Play verse",
    "verse.tafsir": "View Tafsir",
    "verse.bookmark": "Mark as last read",
    "verse.save": "Save verse",
    "verse.unsave": "Remove from saved",

    // Settings
    "settings.title": "Settings",
    "settings.description": "Customize the app appearance according to your preferences",
    "settings.theme": "Theme",
    "settings.language": "Language",
    "settings.typography": "Typography",
    "settings.arabic_font_size": "Arabic Font Size",
    "settings.translation_font_size": "Translation Font Size",
    "settings.light": "Light",
    "settings.dark": "Dark",
    "settings.system": "System",
    "settings.indonesian": "Bahasa Indonesia",
    "settings.english": "English",
    "settings.reset": "Reset",
    "settings.cancel": "Cancel",
    "settings.save": "Save",

    // Tafsir
    "tafsir.title": "Tafsir",
    "tafsir.verse": "Verse",
    "tafsir.source": "Ministry of Religious Affairs Tafsir",

    // Toast Messages
    "toast.bookmark_saved": "Bookmark Saved",
    "toast.bookmark_description": "has been marked as last read.",
    "toast.verse_saved": "Verse Saved",
    "toast.saved_description": "has been saved to your collection.",
    "toast.verse_removed": "Verse Removed",
    "toast.removed_description": "has been removed from your collection.",

    // Search
    "search.placeholder": "Search surah...",
    "search.no_results": "No results found",
    "search.results": "Search results",
    "search.try_different": "Try different keywords",

    // Audio
    "audio.verse": "Verse",

    // Saved Verses
    "saved_verses.title": "Saved Verses",
    "saved_verses.description": "Collection of verses you have saved for future reading",
    "saved_verses.empty_description": "No saved verses yet",
    "saved_verses.no_verses": "No saved verses yet",
    "saved_verses.start_saving": "Start saving your favorite verses by pressing the heart button",
    "saved_verses.saved_on": "Saved on",
  },
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>("id")

  useEffect(() => {
    const savedLanguage = localStorage.getItem("quran-language") as Language
    if (savedLanguage && (savedLanguage === "id" || savedLanguage === "en")) {
      setLanguageState(savedLanguage)
    }
  }, [])

  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
    localStorage.setItem("quran-language", lang)
  }

  const t = (key: string): string => {
    return translations[language][key] || key
  }

  return <LanguageContext.Provider value={{ language, setLanguage, t }}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}

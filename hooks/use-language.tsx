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
    "home.title": "Beranda",
    "nav.surah": "Surah",
    "menu.saved": "Tersimpan",
    "menu.settings": "Pengaturan",
    "menu.language": "Bahasa",

    // Surah Detail
    "surah.verses": "ayat",
    "surah.play_all": "Putar Semua",
    "surah.stop": "Berhenti",
    "surah.back": "Kembali",
    "surah.bismillah": "Dengan menyebut nama Allah Yang Maha Pemurah lagi Maha Penyayang.",

    // Verse Actions
    "verse.play": "Putar ayat",
    "verse.tafsir": "Lihat Tafsir",
    "verse.bookmark": "Tandai Terakhir Baca",
    "verse.marked_last_read": "Terakhir Dibaca",
    "verse.save": "Simpan Ayat",
    "verse.unsave": "Hapus Simpanan",
    "verse.export": "Ekspor Gambar",
    "verse.surah_label": "Surah",
    "verse.verse_label": "Ayat",

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
    "tafsir.attribution": "Disadur dari basis data tafsir Kemenag RI",
    "tafsir.only_indonesian": "Tafsir saat ini hanya tersedia dalam bahasa Indonesia.",
    "tafsir.prev_verse": "Ayat sebelumnya",
    "tafsir.next_verse": "Ayat selanjutnya",
    "tafsir.loading": "Memuat tafsir",
    "tafsir.load_error": "Gagal memuat tafsir. Periksa koneksi Anda lalu coba lagi.",
    "tafsir.retry": "Coba lagi",
    "tafsir.not_available": "Tafsir untuk ayat ini tidak tersedia.",

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
    "saved_verses.title": "Simpan Ayat",
    "saved_verses.description": "Kumpulan ayat yang telah Anda simpan untuk dibaca kembali",
    "saved_verses.empty_description": "Belum ada ayat yang disimpan",
    "saved_verses.no_verses": "Belum ada ayat tersimpan",
    "saved_verses.start_saving": "Mulai simpan ayat favorit Anda dengan menekan ikon bookmark",
    "saved_verses.saved_on": "Disimpan pada",
    "saved_verses.remove": "Hapus ayat",

    // Shared UI
    "common.back_to_top": "Kembali ke atas",
    "common.grid_view": "Tampilan grid",
    "common.list_view": "Tampilan daftar",
    "common.previous": "Sebelumnya",
    "common.next": "Selanjutnya",
    "reader.home": "Beranda",
    "juz.start": "Mulai",
    "search.placeholder_juz": "Cari juz...",
    "search.searching_verses": "Mencari terjemahan ayat...",
    "search.network_error": "Terjadi kesalahan jaringan saat mencari.",

    // Settings details
    "settings.theme_section": "Tema Warna",
    "settings.sepia": "Sepia",
    "settings.arabic_font": "Jenis Font Arab",
    "settings.latin_font": "Jenis Font Latin",
    "settings.reading_mode": "Mode Baca",
    "settings.reading_mode_hint": "Pilih mau menampilkan teks Arab, terjemahan, atau keduanya saat membaca.",
    "settings.mode_both": "Arab + Terjemahan",
    "settings.mode_arabic": "Arab saja",
    "settings.mode_translation": "Terjemahan saja",
    "settings.select_language": "Pilih bahasa",

    // Verse actions & share
    "verse.play_audio": "Putar Murottal",
    "verse.stop_audio": "Hentikan Murottal",
    "verse.share": "Bagikan",
    "verse.copy_text": "Salin Teks",
    "verse.copy_success": "Berhasil Disalin",
    "verse.copy_success_description": "Ayat telah disalin ke clipboard",
    "verse.copy_failed": "Gagal Menyalin",
    "verse.copy_failed_description": "Terjadi kesalahan, coba lagi",
    "shared.title": "Bagikan Ayat",
    "shared.description": "Bagikan ayat ini dalam bentuk gambar",
    "shared.exporting": "Mengekspor...",
    "shared.download": "Unduh Gambar",
    "shared.copy_link": "Salin Link",
    "shared.copied": "Tersalin!",
    "shared.copied_description": "Link ayat disalin ke clipboard.",
    "shared.theme": "Tema",
    "shared.size": "Ukuran",
    "shared.content": "Konten",
    "shared.show_translation": "Tampilkan Terjemahan",
    "shared.show_transliteration": "Tampilkan Transliterasi",
    "shared.transliteration_unavailable": "Tidak tersedia untuk ayat ini",
    "shared.export_success": "Berhasil!",
    "shared.export_success_description": "Gambar berhasil diunduh.",
    "shared.export_failed": "Gagal",
    "shared.export_failed_description": "Gagal mengekspor gambar. Coba lagi.",
    "search.verse_no_match": "Tidak ada terjemahan ayat yang cocok dengan",
    "search.verse_results_title": "Hasil Pencarian Terjemahan",
    "search.max_results": "Menampilkan maksimal 10 hasil pencarian.",
    "home.hide_temporarily": "Sembunyikan sementara",
    "notfound.title": "Halaman Tidak Ditemukan",
    "notfound.description": "Maaf, surah atau halaman yang Anda cari tidak dapat ditemukan.",
    "notfound.back": "Kembali ke Beranda",
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
    "home.title": "Home",
    "nav.surah": "Surah",
    "menu.saved": "Saved",
    "menu.settings": "Settings",
    "menu.language": "Language",

    // Surah Detail
    "surah.verses": "verses",
    "surah.play_all": "Play All",
    "surah.stop": "Stop",
    "surah.back": "Back",
    "surah.bismillah": "In the name of Allah, the Entirely Merciful, the Especially Merciful.",

    // Verse Actions
    "verse.play": "Play verse",
    "verse.tafsir": "View Tafsir",
    "verse.bookmark": "Mark as Last Read",
    "verse.marked_last_read": "Last Read",
    "verse.save": "Save Verse",
    "verse.unsave": "Remove from Saved",
    "verse.export": "Export Image",
    "verse.surah_label": "Surah",
    "verse.verse_label": "Verse",

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
    "tafsir.attribution": "Adapted from the Kemenag RI tafsir database",
    "tafsir.only_indonesian": "The tafsir is currently only available in Indonesian.",
    "tafsir.prev_verse": "Previous verse",
    "tafsir.next_verse": "Next verse",
    "tafsir.loading": "Loading tafsir",
    "tafsir.load_error": "Could not load the tafsir. Check your connection and try again.",
    "tafsir.retry": "Try again",
    "tafsir.not_available": "No tafsir is available for this verse.",

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
    "saved_verses.start_saving": "Start saving your favorite verses by pressing the bookmark icon",
    "saved_verses.saved_on": "Saved on",
    "saved_verses.remove": "Remove verse",

    // Shared UI
    "common.back_to_top": "Back to top",
    "common.grid_view": "Grid view",
    "common.list_view": "List view",
    "common.previous": "Previous",
    "common.next": "Next",
    "reader.home": "Home",
    "juz.start": "Starts at",
    "search.placeholder_juz": "Search juz...",
    "search.searching_verses": "Searching verse translations...",
    "search.network_error": "A network error occurred while searching.",

    // Settings details
    "settings.theme_section": "Color Theme",
    "settings.sepia": "Sepia",
    "settings.arabic_font": "Arabic Font",
    "settings.latin_font": "Latin Font",
    "settings.reading_mode": "Reading Mode",
    "settings.reading_mode_hint": "Choose whether to show the Arabic text, the translation, or both while reading.",
    "settings.mode_both": "Arabic + Translation",
    "settings.mode_arabic": "Arabic only",
    "settings.mode_translation": "Translation only",
    "settings.select_language": "Select language",

    // Verse actions & share
    "verse.play_audio": "Play recitation",
    "verse.stop_audio": "Stop recitation",
    "verse.share": "Share",
    "verse.copy_text": "Copy Text",
    "verse.copy_success": "Copied",
    "verse.copy_success_description": "The verse has been copied to your clipboard",
    "verse.copy_failed": "Copy Failed",
    "verse.copy_failed_description": "Something went wrong, please try again",
    "shared.title": "Share Verse",
    "shared.description": "Share this verse as an image",
    "shared.exporting": "Exporting...",
    "shared.download": "Download Image",
    "shared.copy_link": "Copy Link",
    "shared.copied": "Copied!",
    "shared.copied_description": "Verse link copied to clipboard.",
    "shared.theme": "Theme",
    "shared.size": "Size",
    "shared.content": "Content",
    "shared.show_translation": "Show Translation",
    "shared.show_transliteration": "Show Transliteration",
    "shared.transliteration_unavailable": "Not available for this verse",
    "shared.export_success": "Done!",
    "shared.export_success_description": "The image has been downloaded.",
    "shared.export_failed": "Failed",
    "shared.export_failed_description": "Could not export the image. Please try again.",
    "search.verse_no_match": "No verse translation matches",
    "search.verse_results_title": "Translation Search Results",
    "search.max_results": "Showing up to 10 results.",
    "home.hide_temporarily": "Hide temporarily",
    "notfound.title": "Page Not Found",
    "notfound.description": "Sorry, the surah or page you are looking for could not be found.",
    "notfound.back": "Back to Home",
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
    return (translations[language] as Record<string, string>)[key] || key
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

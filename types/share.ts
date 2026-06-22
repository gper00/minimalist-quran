export type CardTheme =
  | "teal"       // Teal Emerald (default existing)
  | "navy"       // Dark Navy + Gold (premium)
  | "cream"      // Cream Parchment (klasik)
  | "purple"     // Deep Purple (mistis)
  | "black"      // Black Minimalist
  | "rose";      // Dark Rose + Gold

export type CardRatio = "1:1" | "9:16" | "16:9";

export interface CardOptions {
  theme: CardTheme;
  ratio: CardRatio;
  showTransliteration: boolean;
  showTranslation: boolean;
}

export interface AyahShareData {
  surahName: string;        // "Al-Fatiha"
  surahNameAr: string;      // "الفاتحة"
  surahNumber: number;      // 1
  ayahNumber: number;       // 2
  arabicText: string;       // teks Arab
  translation: string;      // terjemahan Indonesia
  transliteration?: string; // opsional, jika tersedia dari API
}

import { CardTheme } from "@/types/share";

export interface ThemeConfig {
  id: CardTheme;
  label: string;
  description: string;
  bg: string;
  border: string;
  arabicColor: string;
  translationColor: string;
  surahLabelColor: string;
  dividerColor: string;
  numberBg: string;
  numberColor: string;
  watermarkColor: string;
  cornerAccent?: string;
}

export const CARD_THEMES: Record<CardTheme, ThemeConfig> = {
  teal: {
    id: "teal",
    label: "Teal Emerald",
    description: "Default, familiar",
    bg: "#0d9488",
    border: "rgba(218,165,32,0.5)",
    arabicColor: "#ffffff",
    translationColor: "rgba(255,255,255,0.85)",
    surahLabelColor: "#fbbf24",
    dividerColor: "rgba(218,165,32,0.5)",
    numberBg: "rgba(218,165,32,0.2)",
    numberColor: "#fbbf24",
    watermarkColor: "rgba(255,255,255,0.35)",
  },
  navy: {
    id: "navy",
    label: "Dark Navy + Gold",
    description: "Premium, mewah",
    bg: "#0f172a",
    border: "rgba(251,191,36,0.6)",
    arabicColor: "#fef3c7",
    translationColor: "rgba(254,243,199,0.8)",
    surahLabelColor: "#fbbf24",
    dividerColor: "rgba(251,191,36,0.4)",
    numberBg: "rgba(251,191,36,0.15)",
    numberColor: "#fbbf24",
    watermarkColor: "rgba(251,191,36,0.3)",
    cornerAccent: "rgba(251,191,36,0.5)",
  },
  cream: {
    id: "cream",
    label: "Cream Parchment",
    description: "Klasik, antik",
    bg: "#faf6eb",
    border: "rgba(139,105,20,0.4)",
    arabicColor: "#1a0800",
    translationColor: "rgba(60,30,0,0.7)",
    surahLabelColor: "#8B6914",
    dividerColor: "rgba(139,105,20,0.4)",
    numberBg: "rgba(139,105,20,0.1)",
    numberColor: "#8B6914",
    watermarkColor: "rgba(139,105,20,0.3)",
  },
  purple: {
    id: "purple",
    label: "Deep Purple",
    description: "Mistis, unik",
    bg: "#1e1245",
    border: "rgba(167,139,250,0.5)",
    arabicColor: "#e9d5ff",
    translationColor: "rgba(233,213,255,0.8)",
    surahLabelColor: "#c4b5fd",
    dividerColor: "rgba(167,139,250,0.4)",
    numberBg: "rgba(167,139,250,0.15)",
    numberColor: "#c4b5fd",
    watermarkColor: "rgba(167,139,250,0.3)",
  },
  black: {
    id: "black",
    label: "Black Minimalist",
    description: "Clean, modern",
    bg: "#0a0a0a",
    border: "rgba(255,255,255,0.12)",
    arabicColor: "#f5f5f5",
    translationColor: "rgba(240,240,240,0.7)",
    surahLabelColor: "rgba(255,255,255,0.4)",
    dividerColor: "rgba(255,255,255,0.15)",
    numberBg: "rgba(255,255,255,0.08)",
    numberColor: "rgba(255,255,255,0.5)",
    watermarkColor: "rgba(255,255,255,0.2)",
  },
  rose: {
    id: "rose",
    label: "Dark Rose + Gold",
    description: "Hangat, romantis",
    bg: "#1a0a0a",
    border: "rgba(212,175,120,0.6)",
    arabicColor: "#f5e6d0",
    translationColor: "rgba(245,230,208,0.8)",
    surahLabelColor: "#d4af78",
    dividerColor: "rgba(212,175,120,0.4)",
    numberBg: "rgba(212,175,120,0.1)",
    numberColor: "#d4af78",
    watermarkColor: "rgba(212,175,120,0.3)",
  },
};

export const RATIO_DIMENSIONS: Record<string, { width: number; height: number }> = {
  "1:1":  { width: 1080, height: 1080 },
  "9:16": { width: 1080, height: 1920 },
  "16:9": { width: 1920, height: 1080 },
};

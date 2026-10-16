export const ARABIC_FONTS = [
  { id: "Amiri", name: "Amiri", family: '"Amiri", serif', style: "Klasik & Elegan" },
  { id: "Scheherazade New", name: "Scheherazade New", family: '"Scheherazade New", serif', style: "Naskh Tradisional" },
  { id: "Noto Naskh Arabic", name: "Noto Naskh Arabic", family: '"Noto Naskh Arabic", serif', style: "Modern & Jernih" },
  { id: "Lateef", name: "Lateef", family: '"Lateef", serif', style: "Paling Terbaca" },
  { id: "IBM Plex Sans Arabic", name: "IBM Plex Arabic", family: '"IBM Plex Sans Arabic", sans-serif', style: "Bersih & Modern" },
] as const

export const LATIN_FONTS = [
  { id: "Geist", name: "Geist", family: 'var(--font-geist), sans-serif', style: "Clean & Modern" },
  { id: "Work Sans", name: "Work Sans", family: '"Work Sans", sans-serif', style: "Geometric & Modern" },
  { id: "Open Sans", name: "Open Sans", family: '"Open Sans", sans-serif', style: "Humanist & Readable" },
] as const

export type ArabicFontId = (typeof ARABIC_FONTS)[number]["id"]
export type LatinFontId = (typeof LATIN_FONTS)[number]["id"]

// id -> CSS font-family value, used both by the settings hook and by the
// inline pre-hydration script in the root layout.
export const ARABIC_FONT_MAP: Record<string, string> = Object.fromEntries(
  ARABIC_FONTS.map((font) => [font.id, font.family])
)

export const LATIN_FONT_MAP: Record<string, string> = Object.fromEntries(
  LATIN_FONTS.map((font) => [font.id, font.family])
)

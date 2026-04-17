import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function cleanVerseText(text: string, verseNumber: number, surahNumber: number) {
  if (verseNumber === 1 && surahNumber !== 1 && surahNumber !== 9) {
    const bismillah1 = "بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ "
    const bismillah2 = "بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ "
    
    if (text.startsWith(bismillah1)) {
      return text.substring(bismillah1.length).trim()
    } else if (text.startsWith(bismillah2)) {
      return text.substring(bismillah2.length).trim()
    } else if (text.startsWith("بِسْمِ")) {
      return text.split(" ").slice(4).join(" ").trim()
    }
  }
  return text
}

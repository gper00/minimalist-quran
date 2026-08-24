export function formatVerseForShare(
  verseText: string,
  translation: string,
  surahName: string,
  verseNumber: number
): string {
  return `${verseText}\n\n${translation}\n\n— Surah ${surahName}, Ayat ${verseNumber}`
}

export function shareToWhatsApp(text: string): void {
  const url = `https://wa.me/?text=${encodeURIComponent(text)}`
  window.open(url, '_blank', 'noopener,noreferrer')
}

export function shareToTwitter(text: string): void {
  const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`
  window.open(url, '_blank', 'noopener,noreferrer')
}

export function shareToFacebook(text: string): void {
  const url = `https://www.facebook.com/sharer/sharer.php?quote=${encodeURIComponent(text)}`
  window.open(url, '_blank', 'noopener,noreferrer')
}

export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    return false
  }
}

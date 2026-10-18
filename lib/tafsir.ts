// Tafsir is fetched on demand so a surah page stays small. The promise cache
// keeps one request per surah per session, including failures being retried.
export type TafsirText = Record<string, string>

const cache = new Map<number, Promise<TafsirText>>()

export function loadTafsir(surahNumber: number): Promise<TafsirText> {
  const cached = cache.get(surahNumber)
  if (cached) return cached

  const request = fetch(`/data/tafsir/${surahNumber}.json`)
    .then((response) => {
      if (!response.ok) throw new Error(`Tafsir request failed: ${response.status}`)
      return response.json() as Promise<TafsirText>
    })
    .catch((error) => {
      // Drop the rejected promise so the next open can try again.
      cache.delete(surahNumber)
      throw error
    })

  cache.set(surahNumber, request)
  return request
}

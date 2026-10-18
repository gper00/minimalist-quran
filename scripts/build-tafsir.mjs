// Extracts the Kemenag tafsir from data/surah/*.json into standalone static
// files. Tafsir is 76-98% of a surah page's content but is never visible until
// the reader opens the tafsir dialog, so it must not ship in the page payload.
import fs from "node:fs/promises"
import path from "node:path"

const root = process.cwd()
const sourceDir = path.join(root, "data", "surah")
const outDir = path.join(root, "public", "data", "tafsir")

await fs.mkdir(outDir, { recursive: true })

const files = (await fs.readdir(sourceDir)).filter((file) => file.endsWith(".json"))
let verseCount = 0

for (const file of files) {
  const raw = await fs.readFile(path.join(sourceDir, file), "utf-8")
  const surah = JSON.parse(raw)
  const text = surah?.tafsir?.id?.kemenag?.text ?? {}
  verseCount += Object.keys(text).length
  // Keyed by verse number so the dialog can pick one entry.
  await fs.writeFile(path.join(outDir, file), JSON.stringify(text))
}

console.log(`[tafsir] wrote ${files.length} surah files (${verseCount} verses) to public/data/tafsir`)

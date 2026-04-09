export interface JuzInfo {
  number: number;
  start: {
    surah: number;
    surahName: string;
    verse: number;
  };
  end: {
    surah: number;
    surahName: string;
    verse: number;
  };
}

export const JUZ_DATA: JuzInfo[] = [
  { number: 1, start: { surah: 1, surahName: "Al-Fatihah", verse: 1 }, end: { surah: 2, surahName: "Al-Baqarah", verse: 141 } },
  { number: 2, start: { surah: 2, surahName: "Al-Baqarah", verse: 142 }, end: { surah: 2, surahName: "Al-Baqarah", verse: 252 } },
  { number: 3, start: { surah: 2, surahName: "Al-Baqarah", verse: 253 }, end: { surah: 3, surahName: "Ali 'Imran", verse: 92 } },
  { number: 4, start: { surah: 3, surahName: "Ali 'Imran", verse: 93 }, end: { surah: 4, surahName: "An-Nisa'", verse: 23 } },
  { number: 5, start: { surah: 4, surahName: "An-Nisa'", verse: 24 }, end: { surah: 4, surahName: "An-Nisa'", verse: 147 } },
  { number: 6, start: { surah: 4, surahName: "An-Nisa'", verse: 148 }, end: { surah: 5, surahName: "Al-Ma'idah", verse: 81 } },
  { number: 7, start: { surah: 5, surahName: "Al-Ma'idah", verse: 82 }, end: { surah: 6, surahName: "Al-An'am", verse: 110 } },
  { number: 8, start: { surah: 6, surahName: "Al-An'am", verse: 111 }, end: { surah: 7, surahName: "Al-A'raf", verse: 87 } },
  { number: 9, start: { surah: 7, surahName: "Al-A'raf", verse: 88 }, end: { surah: 8, surahName: "Al-Anfal", verse: 40 } },
  { number: 10, start: { surah: 8, surahName: "Al-Anfal", verse: 41 }, end: { surah: 9, surahName: "At-Taubah", verse: 92 } },
  { number: 11, start: { surah: 9, surahName: "At-Taubah", verse: 93 }, end: { surah: 11, surahName: "Hud", verse: 5 } },
  { number: 12, start: { surah: 11, surahName: "Hud", verse: 6 }, end: { surah: 12, surahName: "Yusuf", verse: 52 } },
  { number: 13, start: { surah: 12, surahName: "Yusuf", verse: 53 }, end: { surah: 14, surahName: "Ibrahim", verse: 52 } },
  { number: 14, start: { surah: 15, surahName: "Al-Hijr", verse: 1 }, end: { surah: 16, surahName: "An-Nahl", verse: 128 } },
  { number: 15, start: { surah: 17, surahName: "Al-Isra'", verse: 1 }, end: { surah: 18, surahName: "Al-Kahfi", verse: 74 } },
  { number: 16, start: { surah: 18, surahName: "Al-Kahfi", verse: 75 }, end: { surah: 20, surahName: "Taha", verse: 135 } },
  { number: 17, start: { surah: 21, surahName: "Al-Anbiya'", verse: 1 }, end: { surah: 22, surahName: "Al-Hajj", verse: 78 } },
  { number: 18, start: { surah: 23, surahName: "Al-Mu'minun", verse: 1 }, end: { surah: 25, surahName: "Al-Furqan", verse: 20 } },
  { number: 19, start: { surah: 25, surahName: "Al-Furqan", verse: 21 }, end: { surah: 27, surahName: "An-Naml", verse: 55 } },
  { number: 20, start: { surah: 27, surahName: "An-Naml", verse: 56 }, end: { surah: 29, surahName: "Al-'Ankabut", verse: 45 } },
  { number: 21, start: { surah: 29, surahName: "Al-'Ankabut", verse: 46 }, end: { surah: 33, surahName: "Al-Ahzab", verse: 30 } },
  { number: 22, start: { surah: 33, surahName: "Al-Ahzab", verse: 31 }, end: { surah: 36, surahName: "Ya Sin", verse: 27 } },
  { number: 23, start: { surah: 36, surahName: "Ya Sin", verse: 28 }, end: { surah: 39, surahName: "Az-Zumar", verse: 31 } },
  { number: 24, start: { surah: 39, surahName: "Az-Zumar", verse: 32 }, end: { surah: 41, surahName: "Fussilat", verse: 46 } },
  { number: 25, start: { surah: 41, surahName: "Fussilat", verse: 47 }, end: { surah: 45, surahName: "Al-Jasiyah", verse: 37 } },
  { number: 26, start: { surah: 46, surahName: "Al-Ahqaf", verse: 1 }, end: { surah: 51, surahName: "Az-Zariyat", verse: 30 } },
  { number: 27, start: { surah: 51, surahName: "Az-Zariyat", verse: 31 }, end: { surah: 57, surahName: "Al-Hadid", verse: 29 } },
  { number: 28, start: { surah: 58, surahName: "Al-Mujadalah", verse: 1 }, end: { surah: 66, surahName: "At-Tahrim", verse: 12 } },
  { number: 29, start: { surah: 67, surahName: "Al-Mulk", verse: 1 }, end: { surah: 77, surahName: "Al-Mursalat", verse: 50 } },
  { number: 30, start: { surah: 78, surahName: "An-Naba'", verse: 1 }, end: { surah: 114, surahName: "An-Nas", verse: 6 } },
];

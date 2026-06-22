import { useCallback, useRef, useState } from "react";
import { toPng } from "html-to-image";
import { AyahShareData, CardOptions } from "@/types/share";
import { RATIO_DIMENSIONS } from "@/lib/card-themes";

export function useShareImage() {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);

  const exportImage = useCallback(async (
    data: AyahShareData,
    options: CardOptions
  ) => {
    if (!cardRef.current) return;
    setIsExporting(true);

    try {
      const dim = RATIO_DIMENSIONS[options.ratio];

      // Render pada resolusi penuh (bukan preview scale)
      const dataUrl = await toPng(cardRef.current, {
        width: dim.width,
        height: dim.height,
        pixelRatio: 2, // retina quality
        style: {
          // Override scale preview untuk render full res
          width: `${dim.width}px`,
          height: `${dim.height}px`,
          transform: "scale(1)",
        },
        // Load Google Fonts sebelum render
        fetchRequestInit: {
          cache: "force-cache",
        },
      });

      // Download
      const link = document.createElement("a");
      link.download = `quran-${data.surahName.toLowerCase().replace(/\s/g, "-")}-ayat-${data.ayahNumber}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Export failed:", err);
      throw err;
    } finally {
      setIsExporting(false);
    }
  }, []);

  const copyLink = useCallback((surahNumber: number, ayahNumber: number) => {
    const url = `${window.location.origin}/surah/${surahNumber}#ayat-${ayahNumber}`;
    navigator.clipboard.writeText(url);
  }, []);

  return { cardRef, isExporting, exportImage, copyLink };
}

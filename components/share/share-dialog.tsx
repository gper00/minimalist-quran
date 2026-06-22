"use client";

import { useRef, useState, useCallback } from "react";
import { toPng } from "html-to-image";
import { Download, Link2, Check } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { AyahCard } from "./ayah-card";
import { CARD_THEMES, RATIO_DIMENSIONS } from "@/lib/card-themes";
import type { AyahShareData, CardOptions, CardTheme, CardRatio } from "@/types/share";

interface ShareDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data: AyahShareData;
}

const RATIOS: CardRatio[] = ["1:1", "9:16", "16:9"];

export function ShareDialog({ open, onOpenChange, data }: ShareDialogProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const [isExporting, setIsExporting] = useState(false);
  const [copied, setCopied] = useState(false);

  const [options, setOptions] = useState<CardOptions>({
    theme: "navy",
    ratio: "1:1",
    showTransliteration: false,
    showTranslation: true,
  });

  const dim = RATIO_DIMENSIONS[options.ratio];

  const handleExport = useCallback(async () => {
    if (!cardRef.current) return;
    setIsExporting(true);

    try {
      const dim = RATIO_DIMENSIONS[options.ratio];

      const exportOptions = {
        width: dim.width,
        height: dim.height,
        pixelRatio: 2,
        skipFonts: true,
        style: {
          transform: "scale(1)",
        },
        filter: (node: HTMLElement) => {
          // Skip injecting the problematic Google Fonts stylesheet
          if (node.tagName === 'LINK' && (node as HTMLLinkElement).href.includes('fonts.googleapis.com')) {
            return false;
          }
          return true;
        }
      };

      // Jalankan toPng 2x untuk workaround font loading issue html-to-image
      await toPng(cardRef.current, exportOptions);
      const dataUrl = await toPng(cardRef.current, exportOptions);

      const link = document.createElement("a");
      link.download = `quran-${data.surahName.toLowerCase().replace(/\s+/g, "-")}-ayat-${data.ayahNumber}.png`;
      link.href = dataUrl;
      link.click();

      toast({
        title: "Berhasil!",
        description: "Gambar berhasil diunduh.",
      });
    } catch {
      toast({
        title: "Gagal",
        description: "Gagal mengekspor gambar. Coba lagi.",
      });
    } finally {
      setIsExporting(false);
    }
  }, [options, data, toast]);

  const handleCopyLink = useCallback(() => {
    const url = `${window.location.origin}/surah/${data.surahNumber}#ayat-${data.ayahNumber}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    toast({
      title: "Tersalin!",
      description: "Link ayat disalin ke clipboard.",
    });
    setTimeout(() => setCopied(false), 2000);
  }, [data, toast]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-base font-medium">
            Bagikan Ayat
          </DialogTitle>
          <DialogDescription className="sr-only">Bagikan ayat ini dalam bentuk gambar</DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-5 mt-2">

          {/* Preview Card */}
          <div className="flex justify-center bg-muted/30 rounded-lg p-4 overflow-hidden">
            <div style={{ width: dim.width * 0.35, height: dim.height * 0.35, overflow: 'hidden' }}>
              <div style={{ transform: 'scale(0.35)', transformOrigin: 'top left', width: dim.width, height: dim.height }}>
                <AyahCard ref={cardRef} data={data} options={options} />
              </div>
            </div>
          </div>

          {/* Theme Picker */}
          <div>
            <p className="text-xs text-muted-foreground mb-2 uppercase tracking-wide font-medium">Tema</p>
            <div className="flex gap-2 flex-wrap">
              {(Object.keys(CARD_THEMES) as CardTheme[]).map((themeId) => {
                const t = CARD_THEMES[themeId];
                return (
                  <button
                    key={themeId}
                    onClick={() => setOptions((o) => ({ ...o, theme: themeId }))}
                    className={`flex flex-col items-center gap-1 p-2 rounded-lg border transition-all ${
                      options.theme === themeId
                        ? "border-primary ring-1 ring-primary"
                        : "border-border hover:border-muted-foreground"
                    }`}
                  >
                    <div
                      style={{ background: t.bg, border: `1px solid ${t.border}` }}
                      className="w-8 h-8 rounded-md"
                    />
                    <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                      {t.label.split(" ")[0]}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Ratio Picker */}
          <div>
            <p className="text-xs text-muted-foreground mb-2 uppercase tracking-wide font-medium">Ukuran</p>
            <div className="flex gap-2">
              {RATIOS.map((r) => (
                <button
                  key={r}
                  onClick={() => setOptions((o) => ({ ...o, ratio: r }))}
                  className={`flex flex-col items-center gap-1.5 px-4 py-2 rounded-lg border text-sm transition-all ${
                    options.ratio === r
                      ? "border-primary bg-primary/5 text-primary"
                      : "border-border hover:border-muted-foreground text-muted-foreground"
                  }`}
                >
                  <div className="flex items-end justify-center w-8 h-6">
                    {r === "1:1" && <div className="w-5 h-5 border border-current rounded-sm" />}
                    {r === "9:16" && <div className="w-3 h-5 border border-current rounded-sm" />}
                    {r === "16:9" && <div className="w-6 h-3.5 border border-current rounded-sm" />}
                  </div>
                  <span className="text-xs">{r}</span>
                  <span className="text-[9px] opacity-60">
                    {r === "1:1" ? "Feed" : r === "9:16" ? "Story" : "Landscape"}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Toggles */}
          <div className="flex flex-col gap-3">
            <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">Konten</p>
            <div className="flex items-center justify-between">
              <Label htmlFor="show-translation" className="text-sm cursor-pointer">
                Tampilkan Terjemahan
              </Label>
              <Switch
                id="show-translation"
                checked={options.showTranslation}
                onCheckedChange={(v) => setOptions((o) => ({ ...o, showTranslation: v }))}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="show-transliteration" className="text-sm cursor-pointer">
                  Tampilkan Transliterasi
                </Label>
                {!data.transliteration && (
                  <p className="text-[10px] text-muted-foreground">Tidak tersedia untuk ayat ini</p>
                )}
              </div>
              <Switch
                id="show-transliteration"
                checked={options.showTransliteration}
                disabled={!data.transliteration}
                onCheckedChange={(v) => setOptions((o) => ({ ...o, showTransliteration: v }))}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-1">
            <Button
              onClick={handleExport}
              disabled={isExporting}
              className="flex-1"
            >
              <Download className="w-4 h-4 mr-2" />
              {isExporting ? "Mengekspor..." : "Unduh Gambar"}
            </Button>
            <Button
              variant="outline"
              onClick={handleCopyLink}
              className="flex-1"
            >
              {copied ? (
                <Check className="w-4 h-4 mr-2 text-green-500" />
              ) : (
                <Link2 className="w-4 h-4 mr-2" />
              )}
              {copied ? "Tersalin!" : "Salin Link"}
            </Button>
          </div>

        </div>
      </DialogContent>
    </Dialog>
  );
}

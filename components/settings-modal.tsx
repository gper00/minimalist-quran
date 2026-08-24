"use client"

import { useState, useEffect } from "react"
import { RotateCcw, Palette, Type, Globe, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useSettings } from "@/hooks/use-settings"
import { useLanguage } from "@/hooks/use-language"
import { useTheme } from "next-themes"
import { useAudio } from "@/hooks/use-audio"
import { ARABIC_FONTS, LATIN_FONTS } from "@/lib/fonts"

interface SettingsModalProps {
  isOpen: boolean
  onClose: () => void
}

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const { settings, updateSettings, resetSettings } = useSettings()
  const { language, setLanguage, t } = useLanguage()
  const { theme, setTheme } = useTheme()
  const { currentQariId, setQari } = useAudio()
  const [tempSettings, setTempSettings] = useState(settings)
  const [tempTheme, setTempTheme] = useState<string>("light")
  const [tempQari, setTempQari] = useState(currentQariId)

  useEffect(() => {
    if (isOpen) {
      setTempSettings(settings)
      setTempTheme(theme || "light")
      setTempQari(currentQariId)
    }
  }, [isOpen, settings, theme, currentQariId])

  const handleSave = () => {
    updateSettings(tempSettings)
    setTheme(tempTheme)
    setQari(tempQari)
    onClose()
  }

  const handleThemeChange = (newTheme: string) => {
    setTempTheme(newTheme)
  }

  const handleReset = () => {
    resetSettings()
    setTempSettings({
      arabicFontSize: 24,
      translationFontSize: 16,
      showTranslation: true,
      showArabicText: true,
      arabicFont: "Amiri",
      latinFont: "Geist",
    })
    setTempTheme("light")
    setTempQari("alafasy")
    setQari("alafasy")
  }

  const handleCancel = () => {
    setTempSettings(settings)
    setTempTheme(theme || "light")
    setTempQari(currentQariId)
    onClose()
  }

  const themes = [
    { id: "light", name: "Light", color: "bg-white border-gray-200" },
    { id: "sepia", name: "Sepia", color: "bg-[#f4ecd8] border-[#e2d6b5]" },
    { id: "dark", name: "Dark", color: "bg-[#1a1a1a] border-gray-800" },
  ]

  return (
    <Dialog open={isOpen} onOpenChange={handleCancel}>
      <DialogContent className="max-w-lg w-[95vw] rounded-3xl p-0 overflow-hidden border border-border/40 bg-background/95 backdrop-blur-xl shadow-2xl">
        {/* Sticky Header */}
        <div className="sticky top-0 z-10 px-8 py-6 pb-4 bg-background/80 backdrop-blur-xl border-b border-border/30">
          <DialogHeader className="space-y-1.5 text-left">
            <DialogTitle className="text-2xl font-bold tracking-tight text-foreground">
              {t("settings.title")}
            </DialogTitle>
            <DialogDescription className="text-sm font-medium text-muted-foreground/80">
              {t("settings.description")}
            </DialogDescription>
          </DialogHeader>
        </div>

        {/* Scrollable Content */}
        <div className="px-8 py-6 space-y-10 max-h-[60vh] overflow-y-auto overflow-x-hidden">
          <div className="space-y-8">

            {/* Theme Selector */}
            <div className="space-y-4">
              <Label className="text-sm font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                <Palette className="w-4 h-4" />
                Tema Warna
              </Label>
              <div className="grid grid-cols-3 gap-3">
                {themes.map((themeOption) => (
                  <button
                    key={themeOption.id}
                    onClick={() => handleThemeChange(themeOption.id)}
                    className={`
                      relative flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all duration-200
                      ${tempTheme === themeOption.id 
                        ? "border-primary bg-primary/5 ring-4 ring-primary/10" 
                        : "border-transparent bg-muted/50 hover:bg-muted"}
                    `}
                  >
                    <div className={`w-10 h-10 rounded-full border shadow-sm ${themeOption.color} flex items-center justify-center`}>
                      {tempTheme === themeOption.id && <Check className={`w-5 h-5 ${themeOption.id === 'light' || themeOption.id === 'sepia' ? 'text-gray-800' : 'text-white'}`} />}
                    </div>
                    <span className="text-xs font-medium">{themeOption.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Typography Settings */}
            <div className="space-y-6">
              <Label className="text-sm font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                <Type className="w-4 h-4" />
                {t("settings.typography")}
              </Label>

              {/* Arabic Font Family Picker */}
              <div className="space-y-4 px-1">
                <Label className="text-sm font-medium">Jenis Font Arab</Label>
                <div className="grid grid-cols-3 gap-2">
                  {ARABIC_FONTS.map((font) => (
                    <button
                      key={font.id}
                      onClick={() => setTempSettings({ ...tempSettings, arabicFont: font.id })}
                      className={`
                        flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition-all duration-200
                        ${tempSettings.arabicFont === font.id
                          ? "border-primary bg-primary/5 ring-2 ring-primary/10"
                          : "border-transparent bg-muted/50 hover:bg-muted"}
                      `}
                    >
                      <span className="text-lg text-foreground" style={{ fontFamily: font.family }}>بسم الله</span>
                      <span className="text-[10px] font-medium text-muted-foreground">{font.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Latin Font Family Picker */}
              <div className="space-y-4 px-1">
                <Label className="text-sm font-medium">Jenis Font Latin</Label>
                <div className="grid grid-cols-2 gap-2">
                  {LATIN_FONTS.map((font) => (
                    <button
                      key={font.id}
                      onClick={() => setTempSettings({ ...tempSettings, latinFont: font.id })}
                      className={`
                        flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition-all duration-200
                        ${tempSettings.latinFont === font.id
                          ? "border-primary bg-primary/5 ring-2 ring-primary/10"
                          : "border-transparent bg-muted/50 hover:bg-muted"}
                      `}
                    >
                      <span className="text-sm text-foreground" style={{ fontFamily: font.family }}>Al-Fatiha</span>
                      <span className="text-[10px] font-medium text-muted-foreground">{font.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Arabic Font Size */}
              <div className="space-y-4 px-1">
                <div className="flex justify-between items-end">
                  <Label className="text-sm font-medium">{t("settings.arabic_font_size")}</Label>
                  <span className="text-xs font-bold bg-primary/10 text-primary px-2 py-0.5 rounded-full">{tempSettings.arabicFontSize}px</span>
                </div>
                <Slider
                  min={18}
                  max={42}
                  step={2}
                  value={[tempSettings.arabicFontSize]}
                  onValueChange={([value]) => setTempSettings({ ...tempSettings, arabicFontSize: value })}
                  className="py-4"
                />
              </div>

              {/* Translation Font Size */}
              {tempSettings.showTranslation && (
                <div className="space-y-4 px-1">
                  <div className="flex justify-between items-end">
                    <Label className="text-sm font-medium">{t("settings.translation_font_size")}</Label>
                    <span className="text-xs font-bold bg-primary/10 text-primary px-2 py-0.5 rounded-full">{tempSettings.translationFontSize}px</span>
                  </div>
                  <Slider
                    min={12}
                    max={24}
                    step={1}
                    value={[tempSettings.translationFontSize]}
                    onValueChange={([value]) => setTempSettings({ ...tempSettings, translationFontSize: value })}
                    className="py-4"
                  />
                </div>
              )}

              {/* Show Translation Toggle */}
              <div className="space-y-4 px-1">
                <div className="flex justify-between items-center bg-muted/40 p-4 rounded-2xl border border-border/30 hover:bg-muted/60 transition-colors">
                  <Label className="text-sm font-semibold cursor-pointer" onClick={() => setTempSettings({ ...tempSettings, showTranslation: !tempSettings.showTranslation })}>
                    Tampilkan Terjemahan
                  </Label>
                  <button 
                    onClick={() => setTempSettings({ ...tempSettings, showTranslation: !tempSettings.showTranslation })}
                    className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${tempSettings.showTranslation ? 'bg-primary' : 'bg-muted-foreground/30'}`}
                  >
                    <span 
                      className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition-transform ${tempSettings.showTranslation ? 'translate-x-6' : 'translate-x-1'}`}
                    />
                  </button>
                </div>
              </div>

              {/* Show Arabic Text Toggle */}
              <div className="space-y-4 px-1">
                <div className="flex justify-between items-center bg-muted/40 p-4 rounded-2xl border border-border/30 hover:bg-muted/60 transition-colors">
                  <Label className="text-sm font-semibold cursor-pointer" onClick={() => setTempSettings({ ...tempSettings, showArabicText: !tempSettings.showArabicText })}>
                    Tampilkan Teks Arab
                  </Label>
                  <button 
                    onClick={() => setTempSettings({ ...tempSettings, showArabicText: !tempSettings.showArabicText })}
                    className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${tempSettings.showArabicText ? 'bg-primary' : 'bg-muted-foreground/30'}`}
                  >
                    <span 
                      className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition-transform ${tempSettings.showArabicText ? 'translate-x-6' : 'translate-x-1'}`}
                    />
                  </button>
                </div>
              </div>
            </div>

            {/* Language Selection */}
            <div className="space-y-4">
              <Label className="text-sm font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                <Globe className="w-4 h-4" />
                {t("settings.language")}
              </Label>
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger className="h-12 rounded-xl bg-muted/50 border-none px-4">
                  <SelectValue placeholder="Pilih bahasa" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-none shadow-xl">
                  <SelectItem value="id" className="rounded-lg">{t("settings.indonesian")}</SelectItem>
                  <SelectItem value="en" className="rounded-lg">{t("settings.english")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-6 px-8 bg-background/50 backdrop-blur-md flex items-center gap-4 border-t border-border/30">
          <Button
            variant="outline"
            onClick={handleReset}
            className="flex-none h-12 w-12 p-0 rounded-2xl hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 transition-all duration-300"
            title={t("settings.reset")}
          >
            <RotateCcw className="w-5 h-5" />
          </Button>
          <div className="flex gap-3 flex-1">
            <Button 
              variant="outline" 
              onClick={handleCancel} 
              className="flex-1 h-12 rounded-2xl font-bold bg-transparent hover:bg-muted/50 transition-colors"
            >
              {t("settings.cancel")}
            </Button>
            <Button 
              onClick={handleSave} 
              className="flex-[1.5] h-12 rounded-2xl font-bold shadow-xl shadow-primary/20 hover:shadow-primary/30 hover:scale-[1.02] transition-all duration-300 active:scale-95"
            >
              {t("settings.save")}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

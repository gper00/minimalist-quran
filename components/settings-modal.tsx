"use client"

import { useState, useEffect } from "react"
import { RotateCcw, Palette, Type, Globe, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { useSettings } from "@/hooks/use-settings"
import { useLanguage } from "@/hooks/use-language"
import { useTheme } from "next-themes"

interface SettingsModalProps {
  isOpen: boolean
  onClose: () => void
}

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const { settings, updateSettings, resetSettings } = useSettings()
  const { language, setLanguage, t } = useLanguage()
  const { theme, setTheme } = useTheme()
  const [tempSettings, setTempSettings] = useState(settings)
  const [tempTheme, setTempTheme] = useState<string>("light")

  useEffect(() => {
    if (isOpen) {
      setTempSettings(settings)
      setTempTheme(theme || "light")
    }
  }, [isOpen, settings, theme])

  const handleSave = () => {
    updateSettings(tempSettings)
    setTheme(tempTheme)
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
      showTranslation: true
    })
    setTempTheme("light")
  }

  const handleCancel = () => {
    setTempSettings(settings)
    setTempTheme(theme || "light")
    onClose()
  }

  const themes = [
    { id: "light", name: "Light", color: "bg-white border-gray-200" },
    { id: "sepia", name: "Sepia", color: "bg-[#f4ecd8] border-[#e2d6b5]" },
    { id: "dark", name: "Dark", color: "bg-[#1a1a1a] border-gray-800" },
  ]

  return (
    <Dialog open={isOpen} onOpenChange={handleCancel}>
      <DialogContent className="max-w-md w-[95vw] rounded-2xl p-0 overflow-hidden border-none bg-background">
        <div className="p-6 space-y-8">
          <DialogHeader className="space-y-1 text-left">
            <DialogTitle className="text-2xl font-bold tracking-tight">
              {t("settings.title")}
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              {t("settings.description")}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-8">
            {/* Theme Selector - Visual Pill Style */}
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
                <div className="flex justify-between items-center bg-muted/30 p-3 rounded-xl border border-border/50">
                  <Label className="text-sm font-medium cursor-pointer" onClick={() => setTempSettings({ ...tempSettings, showTranslation: !tempSettings.showTranslation })}>
                    Tampilkan Terjemahan
                  </Label>
                  <button 
                    onClick={() => setTempSettings({ ...tempSettings, showTranslation: !tempSettings.showTranslation })}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${tempSettings.showTranslation ? 'bg-primary' : 'bg-muted-foreground/30'}`}
                  >
                    <span 
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${tempSettings.showTranslation ? 'translate-x-6' : 'translate-x-1'}`}
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
        <div className="p-6 bg-muted/30 flex items-center gap-3 border-t border-border/50">
          <Button
            variant="ghost"
            onClick={handleReset}
            className="flex-none h-12 w-12 p-0 rounded-xl hover:bg-rose-50 hover:text-rose-600 transition-colors"
            title={t("settings.reset")}
          >
            <RotateCcw className="w-5 h-5" />
          </Button>
          <div className="flex gap-2 flex-1">
            <Button 
              variant="ghost" 
              onClick={handleCancel} 
              className="flex-1 h-12 rounded-xl font-medium hover:bg-muted transition-colors"
            >
              {t("settings.cancel")}
            </Button>
            <Button 
              onClick={handleSave} 
              className="flex-[1.5] h-12 rounded-xl font-bold shadow-lg shadow-primary/20 transition-transform active:scale-95"
            >
              {t("settings.save")}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

"use client"

import { useState } from "react"
import { RotateCcw, Palette, Type, Globe } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { useSettings } from "@/hooks/use-settings"
import { useLanguage } from "@/hooks/use-language"

interface SettingsModalProps {
  isOpen: boolean
  onClose: () => void
}

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const { settings, updateSettings, resetSettings } = useSettings()
  const { language, setLanguage, t } = useLanguage()
  const [tempSettings, setTempSettings] = useState(settings)

  const handleSave = () => {
    updateSettings(tempSettings)
    onClose()
  }

  const handleReset = () => {
    resetSettings()
    setTempSettings(settings)
  }

  const handleCancel = () => {
    setTempSettings(settings)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleCancel}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader className="space-y-3">
          <DialogTitle className="flex items-center space-x-2 text-xl">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <Palette className="w-4 h-4 text-primary" />
            </div>
            <span>{t("settings.title")}</span>
          </DialogTitle>
          <DialogDescription className="text-base">{t("settings.description")}</DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Language Selection */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Globe className="w-4 h-4 text-primary" />
              <Label className="text-base font-medium">{t("settings.language")}</Label>
            </div>
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger className="h-10">
                <SelectValue placeholder="Pilih bahasa" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="id">{t("settings.indonesian")}</SelectItem>
                <SelectItem value="en">{t("settings.english")}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Separator />

          {/* Typography Settings */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Type className="w-4 h-4 text-primary" />
              <Label className="text-base font-medium">{t("settings.typography")}</Label>
            </div>

            {/* Arabic Font Size */}
            <div className="space-y-3">
              <Label className="text-sm font-medium text-muted-foreground">{t("settings.arabic_font_size")}</Label>
              <div className="px-2">
                <Slider
                  min={18}
                  max={36}
                  step={2}
                  value={[tempSettings.arabicFontSize]}
                  onValueChange={([value]) => setTempSettings({ ...tempSettings, arabicFontSize: value })}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>18px</span>
                  <span className="font-medium">{tempSettings.arabicFontSize}px</span>
                  <span>36px</span>
                </div>
              </div>
              {/* Preview */}
              <div className="p-3 bg-muted/30 rounded-lg border border-border/50">
                <p
                  className="font-arabic text-right text-foreground"
                  style={{ fontSize: `${tempSettings.arabicFontSize}px`, lineHeight: 1.8 }}
                >
                  بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
                </p>
              </div>
            </div>

            {/* Translation Font Size */}
            <div className="space-y-3">
              <Label className="text-sm font-medium text-muted-foreground">{t("settings.translation_font_size")}</Label>
              <div className="px-2">
                <Slider
                  min={12}
                  max={20}
                  step={1}
                  value={[tempSettings.translationFontSize]}
                  onValueChange={([value]) => setTempSettings({ ...tempSettings, translationFontSize: value })}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>12px</span>
                  <span className="font-medium">{tempSettings.translationFontSize}px</span>
                  <span>20px</span>
                </div>
              </div>
              {/* Preview */}
              <div className="p-3 bg-muted/30 rounded-lg border border-border/50">
                <p
                  className="text-muted-foreground"
                  style={{ fontSize: `${tempSettings.translationFontSize}px`, lineHeight: 1.6 }}
                >
                  {language === "en"
                    ? "In the name of Allah, the Entirely Merciful, the Especially Merciful."
                    : "Dengan menyebut nama Allah Yang Maha Pemurah lagi Maha Penyayang."}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-between pt-4 border-t border-border">
          <Button
            variant="outline"
            onClick={handleReset}
            className="flex items-center space-x-2 h-10 px-4 bg-transparent"
          >
            <RotateCcw className="w-4 h-4" />
            <span>{t("settings.reset")}</span>
          </Button>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={handleCancel} className="h-10 px-4 bg-transparent">
              {t("settings.cancel")}
            </Button>
            <Button onClick={handleSave} className="h-10 px-4">
              {t("settings.save")}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

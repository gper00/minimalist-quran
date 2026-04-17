"use client"

import { useState } from "react"
import { Settings, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { SettingsModal } from "./settings-modal"
import { SavedVersesModal } from "./saved-verses-modal"
import { useLanguage } from "@/hooks/use-language"
import { useHideOnScroll } from "@/hooks/use-hide-on-scroll"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export function Header({ centeredBrand = false }: { centeredBrand?: boolean }) {
  const { language, setLanguage, t } = useLanguage()
  const [showSettings, setShowSettings] = useState(false)
  const [showSavedVerses, setShowSavedVerses] = useState(false)
  const isVisible = useHideOnScroll()

  return (
    <>
      <header
        className={`z-50 w-full transition-transform duration-300 bg-background/80 backdrop-blur-md ${isVisible ? "translate-y-0" : "-translate-y-full"}`}
      >
        <div className={`flex h-14 items-center justify-between ${centeredBrand ? "px-4 md:px-8" : "container mx-auto max-w-5xl px-4 md:px-6"}`}>
          {/* Logo Section */}
          <div className="flex items-center space-x-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <span className="text-lg font-black">ق</span>
            </div>
            <h1 className="text-base font-bold tracking-tight text-foreground">{t("app.title")}</h1>
          </div>

          {/* Actions Section */}
          <div className="flex items-center gap-0.5">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-9 w-9 rounded-lg hover:bg-muted/50">
                  <span className="text-[10px] font-bold uppercase tracking-widest opacity-60">{language}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40 rounded-xl border-none shadow-xl">
                <DropdownMenuItem
                  onClick={() => setLanguage("id")}
                  className={`rounded-lg cursor-pointer ${language === "id" ? "bg-primary/10 text-primary font-bold" : ""}`}
                >
                  Indonesian
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setLanguage("en")}
                  className={`rounded-lg cursor-pointer ${language === "en" ? "bg-primary/10 text-primary font-bold" : ""}`}
                >
                  English
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 rounded-lg hover:bg-muted/50"
              onClick={() => setShowSavedVerses(true)}
              title={t("saved_verses.title")}
            >
              <Heart className="h-4 w-4 opacity-60" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 rounded-lg hover:bg-muted/50"
              onClick={() => setShowSettings(true)}
              title={t("header.settings")}
            >
              <Settings className="h-4 w-4 opacity-60" />
            </Button>
          </div>
        </div>
      </header>

      <SavedVersesModal isOpen={showSavedVerses} onClose={() => setShowSavedVerses(false)} />
      <SettingsModal isOpen={showSettings} onClose={() => setShowSettings(false)} />
    </>
  )
}

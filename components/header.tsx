"use client"

import { useState } from "react"
import { Settings, Languages, Heart } from "lucide-react"
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
        className={`hidden md:block z-50 w-full transition-transform duration-300 bg-background/80 backdrop-blur-md ${isVisible ? "translate-y-0" : "-translate-y-full"}`}
      >
        <div className="flex h-14 md:h-16 items-center justify-between px-6">
          {/* Logo Section */}
          <div className={`flex items-center space-x-3 ${centeredBrand ? "flex-1 justify-center translate-x-12" : ""}`}>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <span className="text-xl font-black">ق</span>
            </div>
            <h1 className="text-lg font-bold tracking-tight text-foreground">{t("app.title")}</h1>
          </div>

          {/* Actions Section */}
          <div className="flex items-center space-x-1 flex-none">
            <DropdownMenu>
...

              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl hover:bg-muted/50">
                  <span className="text-xs font-bold uppercase tracking-widest opacity-60 group-hover:opacity-100">{language}</span>
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
              className="h-10 w-10 rounded-xl hover:bg-muted/50"
              onClick={() => setShowSavedVerses(true)}
              title={t("saved_verses.title")}
            >
              <Heart className="h-5 w-5 opacity-60" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 rounded-xl hover:bg-muted/50"
              onClick={() => setShowSettings(true)}
              title={t("header.settings")}
            >
              <Settings className="h-5 w-5 opacity-60" />
            </Button>
          </div>
        </div>
      </header>

      <SavedVersesModal isOpen={showSavedVerses} onClose={() => setShowSavedVerses(false)} />
      <SettingsModal isOpen={showSettings} onClose={() => setShowSettings(false)} />
    </>
  )
}

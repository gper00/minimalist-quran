"use client"

import { useState } from "react"
import { Settings, Languages, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { SettingsModal } from "./settings-modal"
import { SavedVersesModal } from "./saved-verses-modal"
import { useLanguage } from "@/hooks/use-language"
import { useHideOnScroll } from "@/hooks/use-hide-on-scroll"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export function Header() {
  const { language, setLanguage, t } = useLanguage()
  const [showSettings, setShowSettings] = useState(false)
  const [showSavedVerses, setShowSavedVerses] = useState(false)
  const isVisible = useHideOnScroll()

  return (
    <>
      <header
        className={`sticky top-0 z-50 w-full border-b bg-white transition-transform duration-300 ${isVisible ? "translate-y-0" : "-translate-y-full"}`}
      >
        <div className="container flex h-14 md:h-16 items-center justify-between px-3 md:px-6">
          <div className="flex items-center space-x-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100">
              <span className="text-lg font-bold text-blue-600">ق</span>
            </div>
            <h1 className="hidden md:block text-lg md:text-xl font-bold text-gray-900">{t("app.title")}</h1>
          </div>

          <div className="flex items-center space-x-1">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-9 w-9 md:h-10 md:w-10 rounded-lg hover:bg-gray-100">
                  <Languages className="h-4 w-4" />
                  <span className="sr-only">Switch language</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40">
                <DropdownMenuItem
                  onClick={() => setLanguage("id")}
                  className={language === "id" ? "bg-blue-50 text-blue-600 font-medium" : ""}
                >
                  {t("settings.indonesian")}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setLanguage("en")}
                  className={language === "en" ? "bg-blue-50 text-blue-600 font-medium" : ""}
                >
                  {t("settings.english")}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 md:h-10 md:w-10 rounded-lg hover:bg-gray-100"
              onClick={() => setShowSavedVerses(true)}
              title={t("saved_verses.title")}
            >
              <Heart className="h-4 w-4" />
              <span className="sr-only">{t("saved_verses.title")}</span>
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 md:h-10 md:w-10 rounded-lg hover:bg-gray-100"
              onClick={() => setShowSettings(true)}
              title={t("header.settings")}
            >
              <Settings className="h-4 w-4" />
              <span className="sr-only">{t("header.settings")}</span>
            </Button>
          </div>
        </div>
      </header>

      <SavedVersesModal isOpen={showSavedVerses} onClose={() => setShowSavedVerses(false)} />
      <SettingsModal isOpen={showSettings} onClose={() => setShowSettings(false)} />
    </>
  )
}

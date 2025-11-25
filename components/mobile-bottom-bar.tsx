"use client"

import Link from "next/link"
import { useState } from "react"
import { Home, Heart, Settings, Languages } from "lucide-react"
import { usePathname } from "next/navigation"
import { useLanguage } from "@/hooks/use-language"
import { SavedVersesModal } from "@/components/saved-verses-modal"
import { SettingsModal } from "@/components/settings-modal"
import { cn } from "@/lib/utils"

export function MobileBottomBar() {
  const pathname = usePathname()
  const { language, setLanguage, t } = useLanguage()
  const [showSaved, setShowSaved] = useState(false)
  const [showSettings, setShowSettings] = useState(false)

  const toggleLanguage = () => {
    setLanguage(language === "id" ? "en" : "id")
  }

  return (
    <>
      <nav
        className="md:hidden fixed bottom-0 inset-x-0 z-40 border-t bg-white"
        style={{
          paddingBottom: "max(env(safe-area-inset-bottom), 0px)",
        }}
        aria-label="Bottom Navigation"
      >
        <ul className="grid grid-cols-4 gap-0">
          <li>
            <Link
              href="/"
              className={cn(
                "flex flex-col items-center justify-center py-3 transition-colors",
                pathname === "/" ? "text-blue-600" : "text-gray-600 hover:text-gray-900",
              )}
              aria-current={pathname === "/" ? "page" : undefined}
            >
              <Home className="h-6 w-6 mb-1" />
              <span className="text-xs font-medium">{t("home.title") || "Home"}</span>
            </Link>
          </li>
          <li>
            <button
              className="w-full flex flex-col items-center justify-center py-3 text-gray-600 hover:text-gray-900 transition-colors"
              onClick={() => setShowSaved(true)}
              aria-label={t("saved_verses.title")}
            >
              <Heart className="h-6 w-6 mb-1" />
              <span className="text-xs font-medium">{t("menu.saved") || "Saved"}</span>
            </button>
          </li>
          <li>
            <button
              className="w-full flex flex-col items-center justify-center py-3 text-gray-600 hover:text-gray-900 transition-colors"
              onClick={() => setShowSettings(true)}
              aria-label={t("header.settings")}
            >
              <Settings className="h-6 w-6 mb-1" />
              <span className="text-xs font-medium">{t("menu.settings") || "Settings"}</span>
            </button>
          </li>
          <li>
            <button
              className="w-full flex flex-col items-center justify-center py-3 text-gray-600 hover:text-gray-900 transition-colors"
              onClick={toggleLanguage}
              aria-label="Toggle language"
            >
              <Languages className="h-6 w-6 mb-1" />
              <span className="text-xs font-medium">{language.toUpperCase()}</span>
            </button>
          </li>
        </ul>
      </nav>

      <SavedVersesModal isOpen={showSaved} onClose={() => setShowSaved(false)} />
      <SettingsModal isOpen={showSettings} onClose={() => setShowSettings(false)} />
    </>
  )
}

export default MobileBottomBar

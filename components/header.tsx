"use client"

import { useState } from "react"
import Link from "next/link"
import { Settings, Bookmark } from "lucide-react"
import { Button } from "@/components/ui/button"
import { SettingsModal } from "./settings-modal"
import { SavedVersesModal } from "./saved-verses-modal"
import { useLanguage } from "@/hooks/use-language"
import { useHideOnScroll } from "@/hooks/use-hide-on-scroll"
import { cn } from "@/lib/utils"

interface HeaderProps {
  /**
   * Flat variant for pages that already sit on the app background:
   * no glass surface, no divider, and no hide-on-scroll animation.
   */
  transparent?: boolean
}

export function Header({ transparent = false }: HeaderProps) {
  const { t } = useLanguage()
  const [showSettings, setShowSettings] = useState(false)
  const [showSavedVerses, setShowSavedVerses] = useState(false)
  const isVisible = useHideOnScroll()

  return (
    <>
      <header
        className={cn(
          "z-50 w-full",
          transparent
            ? "bg-transparent"
            : `glass border-b border-border/10 transition-all duration-300 ${
                isVisible ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
              }`
        )}
      >
        <div className="container mx-auto flex h-16 max-w-5xl items-center justify-between px-4 md:px-6">
          {/* Logo Section */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand/10 text-brand ring-1 ring-inset ring-brand/20 group-hover:bg-brand/20 transition-colors">
              <span className="text-lg font-black">ق</span>
            </div>
            {/* Not an <h1>: the page itself owns the single top-level heading. */}
            <span className="text-lg font-bold tracking-tight text-foreground group-hover:text-brand transition-colors">{t("app.title")}</span>
          </Link>

          {/* Actions Section */}
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 rounded-xl text-muted-foreground hover:text-brand hover:bg-brand/10"
              onClick={() => setShowSavedVerses(true)}
              title={t("saved_verses.title")}
            >
              <Bookmark className="h-4 w-4" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 rounded-xl text-muted-foreground hover:text-brand hover:bg-brand/10"
              onClick={() => setShowSettings(true)}
              title={t("header.settings")}
            >
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <SavedVersesModal isOpen={showSavedVerses} onClose={() => setShowSavedVerses(false)} />
      <SettingsModal isOpen={showSettings} onClose={() => setShowSettings(false)} />
    </>
  )
}

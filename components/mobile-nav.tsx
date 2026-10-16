"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { BookOpen, ListTree, Bookmark, Settings } from "lucide-react"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { SavedVersesModal } from "./saved-verses-modal"
import { SettingsModal } from "./settings-modal"
import { SurahSidebar } from "./surah-sidebar"
import { useLanguage } from "@/hooks/use-language"
import type { Surah } from "@/lib/types"

interface MobileNavProps {
  surahs: Surah[]
}

export function MobileNav({ surahs }: MobileNavProps) {
  const pathname = usePathname()
  const { t } = useLanguage()
  const [showDrawer, setShowDrawer] = useState(false)
  const [showSaved, setShowSaved] = useState(false)
  const [showSettings, setShowSettings] = useState(false)

  const isHome = pathname === "/"

  // Close the surah drawer whenever the route changes
  useEffect(() => {
    setShowDrawer(false)
  }, [pathname])

  const itemClass =
    "flex flex-1 flex-col items-center justify-center gap-1 text-[10px] font-semibold transition-colors"

  return (
    <>
      <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-border/30 glass-strong md:hidden">
        <div className="flex h-14 items-stretch px-1 pb-[env(safe-area-inset-bottom)]">
          <Link
            href="/"
            className={`${itemClass} ${isHome ? "text-brand" : "text-muted-foreground hover:text-brand"}`}
          >
            <span className={`flex h-7 w-12 items-center justify-center rounded-full transition-colors ${isHome ? "bg-brand/10" : ""}`}>
              <BookOpen className="h-5 w-5" />
            </span>
            {t("home.title")}
          </Link>

          <button
            type="button"
            onClick={() => setShowDrawer(true)}
            className={`${itemClass} text-muted-foreground hover:text-brand`}
          >
            <span className="flex h-7 w-12 items-center justify-center rounded-full">
              <ListTree className="h-5 w-5" />
            </span>
            {t("nav.surah")}
          </button>

          <button
            type="button"
            onClick={() => setShowSaved(true)}
            className={`${itemClass} text-muted-foreground hover:text-brand`}
          >
            <span className="flex h-7 w-12 items-center justify-center rounded-full">
              <Bookmark className="h-5 w-5" />
            </span>
            {t("menu.saved")}
          </button>

          <button
            type="button"
            onClick={() => setShowSettings(true)}
            className={`${itemClass} text-muted-foreground hover:text-brand`}
          >
            <span className="flex h-7 w-12 items-center justify-center rounded-full">
              <Settings className="h-5 w-5" />
            </span>
            {t("menu.settings")}
          </button>
        </div>
      </nav>

      {/* Surah Navigation Drawer */}
      <Dialog open={showDrawer} onOpenChange={setShowDrawer}>
        <DialogContent className="max-w-sm w-[90vw] h-[80vh] p-0 rounded-2xl overflow-hidden flex flex-col border border-border/40 glass-strong shadow-2xl">
          <DialogTitle className="sr-only">{t("home.surah_list")}</DialogTitle>
          <div className="flex-1 w-full overflow-hidden">
            <SurahSidebar surahs={surahs} />
          </div>
        </DialogContent>
      </Dialog>

      <SavedVersesModal isOpen={showSaved} onClose={() => setShowSaved(false)} />
      <SettingsModal isOpen={showSettings} onClose={() => setShowSettings(false)} />
    </>
  )
}

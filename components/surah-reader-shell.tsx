"use client"

import { useEffect, useRef, useState, type ReactNode } from "react"
import { Bookmark, PanelLeft, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/hooks/use-language"
import { cn } from "@/lib/utils"
import { BackToTop } from "./back-to-top"
import { SavedVersesModal } from "./saved-verses-modal"
import { SettingsModal } from "./settings-modal"
import { SurahSidebar } from "./surah-sidebar"
import type { Surah } from "@/lib/types"

interface SurahReaderShellProps {
  surahs: Surah[]
  children: ReactNode
}

export function SurahReaderShell({ surahs, children }: SurahReaderShellProps) {
  const { t } = useLanguage()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [showSaved, setShowSaved] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const readerRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    const stored = localStorage.getItem("quran-sidebar-open")
    if (stored === "false") setSidebarOpen(false)
  }, [])

  const toggleSidebar = () => {
    setSidebarOpen((open) => {
      const next = !open
      localStorage.setItem("quran-sidebar-open", String(next))
      return next
    })
  }

  const toolbarButton =
    "h-8 w-8 rounded-lg border border-border/40 bg-background/60 text-muted-foreground backdrop-blur transition-colors hover:border-brand/30 hover:bg-brand/10 hover:text-brand"

  return (
    <>
      {/* No navbar on the reader: the toolbar below carries the only chrome */}
      <div className="flex flex-1 flex-col overflow-hidden md:flex-row">
        {/* Sidebar - Desktop only, collapsible */}
        <aside
          id="desktop-surah-sidebar"
          aria-hidden={!sidebarOpen}
          className={`hidden md:flex flex-col flex-shrink-0 h-full bg-muted/30 overflow-hidden transition-[width,border-color] duration-300 ease-in-out ${
            sidebarOpen ? "w-72 lg:w-80 border-r border-border/10" : "w-0 border-r-0"
          }`}
        >
          <div className="w-72 lg:w-80 h-full">
            <SurahSidebar surahs={surahs} />
          </div>
        </aside>

        {/* Reading Area */}
        <div className="flex-1 flex flex-col h-full overflow-hidden">
          <main ref={readerRef} className="flex-1 h-full overflow-y-auto scroll-smooth custom-scrollbar">
            {/* Floating toolbar in the outer gutters, outside the surah content wrapper */}
            {/* Kept background-free on purpose: the buttons carry their own surface,
                so no band (and no white flash) appears while scrolling. */}
            <div className="sticky top-0 z-30 hidden pb-2 pt-2 md:block">
              <div className="flex items-center justify-between gap-3 px-3 lg:px-4">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleSidebar}
                  className={cn("hidden md:inline-flex", toolbarButton)}
                  aria-expanded={sidebarOpen}
                  aria-controls="desktop-surah-sidebar"
                  title={sidebarOpen ? "Sembunyikan daftar surah" : "Tampilkan daftar surah"}
                  aria-label={sidebarOpen ? "Sembunyikan daftar surah" : "Tampilkan daftar surah"}
                >
                  <PanelLeft className={cn("h-4 w-4 transition-transform duration-300", !sidebarOpen && "rotate-180")} />
                </Button>

                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowSaved(true)}
                    className={cn("hidden md:inline-flex", toolbarButton)}
                    title={t("saved_verses.title")}
                    aria-label={t("saved_verses.title")}
                  >
                    <Bookmark className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowSettings(true)}
                    className={cn("hidden md:inline-flex", toolbarButton)}
                    title={t("header.settings")}
                    aria-label={t("header.settings")}
                  >
                    <Settings className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {children}
          </main>
        </div>
      </div>

      <BackToTop targetRef={readerRef} />

      <SavedVersesModal isOpen={showSaved} onClose={() => setShowSaved(false)} />
      <SettingsModal isOpen={showSettings} onClose={() => setShowSettings(false)} />
    </>
  )
}

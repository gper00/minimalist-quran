"use client"

import { useState } from "react"
import { Menu, Heart, Settings, ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { SavedVersesModal } from "./saved-verses-modal"
import { SettingsModal } from "./settings-modal"
import { SurahSidebar } from "./surah-sidebar"
import { useHideOnScroll } from "@/hooks/use-hide-on-scroll"
import type { Surah } from "@/lib/types"

interface MobileSurahHeaderProps {
  surahName: string
  surahs: Surah[]
}

export function MobileSurahHeader({ surahName, surahs }: MobileSurahHeaderProps) {
  const router = useRouter()
  const isVisible = useHideOnScroll()
  const [showDrawer, setShowDrawer] = useState(false)
  const [showSaved, setShowSaved] = useState(false)
  const [showSettings, setShowSettings] = useState(false)

  return (
    <>
      <header
        className={`w-full border-b border-border/20 bg-background/95 backdrop-blur-md transition-transform duration-300 ${isVisible ? "translate-y-0" : "-translate-y-full"}`}
      >
        <div className="flex h-12 items-center justify-between px-3">
          {/* Left: Back + Hamburger */}
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.back()}
              className="h-9 w-9 rounded-lg"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowDrawer(true)}
              className="h-9 w-9 rounded-lg"
            >
              <Menu className="h-4 w-4" />
            </Button>
          </div>

          {/* Center: Surah Name */}
          <span className="text-sm font-bold text-foreground truncate max-w-[40vw]">
            {surahName}
          </span>

          {/* Right: Actions */}
          <div className="flex items-center gap-0.5">
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 rounded-lg"
              onClick={() => setShowSaved(true)}
            >
              <Heart className="h-4 w-4 opacity-60" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 rounded-lg"
              onClick={() => setShowSettings(true)}
            >
              <Settings className="h-4 w-4 opacity-60" />
            </Button>
          </div>
        </div>
      </header>

      {/* Surah Navigation Drawer */}
      <Dialog open={showDrawer} onOpenChange={setShowDrawer}>
        <DialogContent className="max-w-sm w-[90vw] h-[80vh] p-0 rounded-2xl overflow-hidden flex flex-col border border-border/40 bg-background/95 backdrop-blur-xl shadow-2xl">
          <DialogTitle className="sr-only">Daftar Surah</DialogTitle>
          <div className="flex-1 w-full overflow-hidden" onClick={(e) => {
            if ((e.target as HTMLElement).closest('a')) {
              setShowDrawer(false)
            }
          }}>
            <SurahSidebar surahs={surahs} />
          </div>
        </DialogContent>
      </Dialog>

      <SavedVersesModal isOpen={showSaved} onClose={() => setShowSaved(false)} />
      <SettingsModal isOpen={showSettings} onClose={() => setShowSettings(false)} />
    </>
  )
}

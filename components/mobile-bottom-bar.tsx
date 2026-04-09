"use client"

import { useState } from "react"
import { Home, Heart, Settings, Languages, Menu } from "lucide-react"
import { usePathname, useRouter } from "next/navigation"
import { useLanguage } from "@/hooks/use-language"
import { SavedVersesModal } from "@/components/saved-verses-modal"
import { SettingsModal } from "@/components/settings-modal"
import { cn } from "@/lib/utils"

export function MobileBottomBar() {
  const pathname = usePathname()
  const router = useRouter()
  const { language, setLanguage, t } = useLanguage()
  const [showSaved, setShowSaved] = useState(false)
  const [showSettings, setShowSettings] = useState(false)

  const toggleLanguage = () => {
    setLanguage(language === "id" ? "en" : "id")
  }

  const navItems = [
    { id: 'home', icon: Home, label: 'Home', onClick: () => router.push('/') },
    { id: 'saved', icon: Heart, label: 'Saved', onClick: () => setShowSaved(true) },
    { id: 'settings', icon: Settings, label: 'Settings', onClick: () => setShowSettings(true) },
    { id: 'lang', icon: Languages, label: language.toUpperCase(), onClick: toggleLanguage },
  ]

  return (
    <>
      <div className="md:hidden fixed bottom-6 inset-x-0 z-50 px-6 flex justify-center pointer-events-none">
        <nav
          className="pointer-events-auto bg-background/80 backdrop-blur-xl border border-border/20 shadow-2xl shadow-black/10 px-2 py-2 rounded-3xl flex items-center gap-1 min-w-[280px]"
          aria-label="Bottom Navigation"
        >
          {navItems.map((item) => {
            const isActive = (item.id === 'home' && pathname === '/') || 
                           (pathname.startsWith('/surah') && item.id === 'home');
            
            return (
              <button
                key={item.id}
                onClick={item.onClick}
                className={cn(
                  "flex-1 flex flex-col items-center justify-center py-2 px-1 rounded-2xl transition-all duration-300",
                  isActive 
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20 scale-105" 
                    : "text-muted-foreground hover:bg-muted/50"
                )}
              >
                <item.icon className={cn("h-5 w-5 mb-0.5", isActive ? "stroke-[2.5px]" : "stroke-[2px]")} />
                <span className="text-[10px] font-bold uppercase tracking-tight opacity-80">{item.label}</span>
              </button>
            )
          })}
        </nav>
      </div>

      <SavedVersesModal isOpen={showSaved} onClose={() => setShowSaved(false)} />
      <SettingsModal isOpen={showSettings} onClose={() => setShowSettings(false)} />
    </>
  )
}

export default MobileBottomBar

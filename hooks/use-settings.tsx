"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"

interface Settings {
  arabicFontSize: number
  translationFontSize: number
  showTranslation: boolean
  showArabicText: boolean
  arabicFont: string
  latinFont: string
}

interface SettingsContextType {
  settings: Settings
  updateSettings: (newSettings: Partial<Settings>) => void
  resetSettings: () => void
}

const defaultSettings: Settings = {
  arabicFontSize: 24,
  translationFontSize: 16,
  showTranslation: true,
  showArabicText: true,
  arabicFont: "Amiri",
  latinFont: "Geist",
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined)

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<Settings>(defaultSettings)

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("quran-settings")
      if (stored) {
        try {
          const parsedSettings = JSON.parse(stored)
          setSettings({ ...defaultSettings, ...parsedSettings })
        } catch (error) {
          console.error("Error parsing settings:", error)
        }
      }
    }
  }, [])

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("quran-settings", JSON.stringify(settings))
    }
  }, [settings])

  // Sync font CSS variables with settings for real-time updates
  useEffect(() => {
    if (typeof window !== "undefined") {
      const arabicMap: Record<string, string> = {
        'Amiri': '"Amiri"',
        'Scheherazade New': '"Scheherazade New"',
        'Noto Naskh Arabic': '"Noto Naskh Arabic"'
      }
      const latinMap: Record<string, string> = {
        'Geist': 'var(--font-geist), sans-serif',
        'Work Sans': '"Work Sans", sans-serif',
        'Open Sans': '"Open Sans", sans-serif'
      }
      
      const arabicValue = arabicMap[settings.arabicFont] || '"Amiri"'
      const latinValue = latinMap[settings.latinFont] || '"Work Sans", sans-serif'
      
      document.documentElement.style.setProperty('--font-arabic', arabicValue)
      document.documentElement.style.setProperty('--font-latin', latinValue)
    }
  }, [settings.arabicFont, settings.latinFont])

  const updateSettings = (newSettings: Partial<Settings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }))
  }

  const resetSettings = () => {
    setSettings(defaultSettings)
  }

  return (
    <SettingsContext.Provider value={{ settings, updateSettings, resetSettings }}>{children}</SettingsContext.Provider>
  )
}

export function useSettings() {
  const context = useContext(SettingsContext)
  if (context === undefined) {
    throw new Error("useSettings must be used within a SettingsProvider")
  }
  return context
}

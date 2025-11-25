"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"

interface Settings {
  arabicFontSize: number
  translationFontSize: number
  theme: "light" | "dark" | "system"
}

interface SettingsContextType {
  settings: Settings
  updateSettings: (newSettings: Partial<Settings>) => void
  resetSettings: () => void
}

const defaultSettings: Settings = {
  arabicFontSize: 24, // Default 1.5rem = 24px
  translationFontSize: 16, // Default 1rem = 16px
  theme: "light", // set default to light to match single-theme requirement
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined)

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<Settings>(defaultSettings)

  // Load settings from localStorage on mount
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

  // Save settings to localStorage whenever they change
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("quran-settings", JSON.stringify(settings))
    }
  }, [settings])

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

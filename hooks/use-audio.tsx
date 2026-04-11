"use client"

import React, { createContext, useContext, useState, useRef, useEffect, ReactNode } from "react"
import { useToast } from "@/hooks/use-toast"

export type AudioStatus = "idle" | "loading" | "playing" | "paused" | "error"

interface PlayParams {
  surahNumber: number
  verseNumber: number
  surahName: string
  totalVerses: number
}

interface AudioContextType {
  status: AudioStatus
  currentSurah: number | null
  currentVerse: number | null
  currentSurahName: string | null
  playVerse: (params: PlayParams) => void
  pause: () => void
  resume: () => void
  playNext: () => void
  playPrevious: () => void
  close: () => void
}

const AudioContext = createContext<AudioContextType | undefined>(undefined)

export function AudioProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast()
  const [status, setStatus] = useState<AudioStatus>("idle")
  const [currentSurah, setCurrentSurah] = useState<number | null>(null)
  const [currentVerse, setCurrentVerse] = useState<number | null>(null)
  const [currentSurahName, setCurrentSurahName] = useState<string | null>(null)
  const [totalVerses, setTotalVerses] = useState<number>(0)
  
  const audioRef = useRef<HTMLAudioElement | null>(null)

  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current.src = ""
        audioRef.current = null
      }
    }
  }, [])

  const buildAudioUrl = (surah: number, verse: number) => {
    const surahStr = String(surah).padStart(3, '0')
    const verseStr = String(verse).padStart(3, '0')
    return `https://everyayah.com/data/Alafasy_128kbps/${surahStr}${verseStr}.mp3`
  }

  const handleEnded = () => {
    // Auto-Next Feature!
    if (currentSurah !== null && currentVerse !== null) {
      if (currentVerse < totalVerses) {
        // Play next verse in the same surah
        playVerseInternal(currentSurah, currentVerse + 1, currentSurahName!, totalVerses)
      } else {
        // Finished the entire Surah
        setStatus("idle")
        setCurrentSurah(null)
        setCurrentVerse(null)
      }
    }
  }

  const attachListeners = (audio: HTMLAudioElement) => {
    audio.oncanplay = () => setStatus("playing")
    audio.onplaying = () => setStatus("playing")
    audio.onpause = () => setStatus("paused")
    audio.onended = handleEnded
    audio.onerror = () => {
      setStatus("error")
      toast({
        title: "Koneksi Audio Terputus",
        description: "Gagal memuat murrotal. Periksa koneksi internet Anda.",
        variant: "destructive"
      })
    }
  }

  const playVerseInternal = (surah: number, verse: number, name: string, total: number) => {
    setCurrentSurah(surah)
    setCurrentVerse(verse)
    setCurrentSurahName(name)
    setTotalVerses(total)
    setStatus("loading")

    if (!audioRef.current) {
      audioRef.current = new Audio()
    }
    
    // Pause previous
    audioRef.current.pause()
    
    // Assign new source and play
    const url = buildAudioUrl(surah, verse)
    audioRef.current.src = url
    audioRef.current.load()
    attachListeners(audioRef.current)

    const playPromise = audioRef.current.play()
    if (playPromise !== undefined) {
      playPromise.catch((err) => {
        console.error("Autoplay failed:", err)
        setStatus("error")
      })
    }

    // Auto-scroll to the requested verse
    setTimeout(() => {
      const el = document.getElementById(`verse-${verse}`)
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" })
      }
    }, 100)
  }

  const playVerse = (params: PlayParams) => {
    playVerseInternal(params.surahNumber, params.verseNumber, params.surahName, params.totalVerses)
  }

  const pause = () => {
    if (audioRef.current && status === "playing") {
      audioRef.current.pause()
      setStatus("paused")
    }
  }

  const resume = () => {
    if (audioRef.current && status === "paused") {
      audioRef.current.play()
      setStatus("playing")
    }
  }

  const playNext = () => {
    if (currentSurah !== null && currentVerse !== null && currentVerse < totalVerses) {
      playVerseInternal(currentSurah, currentVerse + 1, currentSurahName!, totalVerses)
    }
  }

  const playPrevious = () => {
    if (currentSurah !== null && currentVerse !== null && currentVerse > 1) {
      playVerseInternal(currentSurah, currentVerse - 1, currentSurahName!, totalVerses)
    }
  }

  const close = () => {
    if (audioRef.current) {
      audioRef.current.pause()
    }
    setStatus("idle")
    setCurrentSurah(null)
    setCurrentVerse(null)
  }

  return (
    <AudioContext.Provider value={{
      status, currentSurah, currentVerse, currentSurahName, 
      playVerse, pause, resume, playNext, playPrevious, close
    }}>
      {children}
    </AudioContext.Provider>
  )
}

export function useAudio() {
  const context = useContext(AudioContext)
  if (context === undefined) {
    throw new Error("useAudio must be used within an AudioProvider")
  }
  return context
}

"use client"

import { useAudio } from "@/hooks/use-audio"
import { Button } from "@/components/ui/button"
import { Play, Pause, SkipForward, SkipBack, X, Loader2, Music4 } from "lucide-react"
import { useEffect, useState } from "react"
import { useLanguage } from "@/hooks/use-language"

export function GlobalAudioPlayer() {
  const { status, currentSurah, currentVerse, currentSurahName, pause, resume, playNext, playPrevious, close } = useAudio()
  const { language } = useLanguage()
  const [isVisible, setIsVisible] = useState(false)

  // Smooth slide-in transition
  useEffect(() => {
    if (status !== "idle" && currentSurah !== null) {
      // Small timeout allows the component to mount in DOM before sliding up
      setTimeout(() => setIsVisible(true), 10)
    } else {
      setIsVisible(false)
    }
  }, [status, currentSurah])

  if (status === "idle" || currentSurah === null) return null

  return (
    <div 
      className={`fixed z-[60] left-0 right-0 sm:left-1/2 sm:right-auto sm:w-[400px] sm:-ml-[200px] transition-all duration-500 ease-in-out ${
        isVisible ? "bottom-[100px] opacity-100 translate-y-0" : "bottom-[-100px] opacity-0 translate-y-10"
      } px-4 py-2`}
    >
      <div className="bg-background/80 backdrop-blur-2xl border border-border/40 shadow-2xl shadow-primary/10 rounded-[28px] p-3 flex items-center justify-between gap-4">
        
        {/* Track Info */}
        <div className="flex items-center gap-3 overflow-hidden ml-2">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
            {status === "loading" ? (
              <Loader2 className="w-5 h-5 text-primary animate-spin" />
            ) : status === "playing" ? (
              <div className="flex items-center gap-0.5 h-4">
                <span className="w-1 h-3 bg-primary rounded-full animate-[bounce_1s_infinite]"></span>
                <span className="w-1 h-4 bg-primary rounded-full animate-[bounce_1s_infinite_100ms]"></span>
                <span className="w-1 h-2 bg-primary rounded-full animate-[bounce_1s_infinite_200ms]"></span>
              </div>
            ) : (
              <Music4 className="w-5 h-5 text-primary/60" />
            )}
          </div>
          <div className="flex flex-col truncate">
            <span className="text-sm font-bold truncate pr-4 text-foreground">
              {currentSurahName}
            </span>
            <span className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground truncate">
              {language === "id" ? "Ayat" : "Verse"} {currentVerse}
            </span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-1 shrink-0">
          <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full text-foreground/70 hover:text-foreground" onClick={playPrevious}>
            <SkipBack className="w-5 h-5" />
          </Button>

          <Button 
            variant="default" 
            size="icon" 
            className="h-12 w-12 rounded-full shadow-lg hover:scale-105 active:scale-95 transition-all text-primary-foreground"
            onClick={status === "playing" ? pause : resume}
          >
            {status === "playing" ? (
              <Pause className="w-6 h-6 fill-current" />
            ) : (
              <Play className="w-6 h-6 fill-current ml-1" />
            )}
          </Button>

          <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full text-foreground/70 hover:text-foreground" onClick={playNext}>
            <SkipForward className="w-5 h-5" />
          </Button>
          
          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full ml-1 text-muted-foreground hover:bg-rose-500/10 hover:text-rose-500" onClick={close}>
            <X className="w-4 h-4" />
          </Button>
        </div>

      </div>
    </div>
  )
}

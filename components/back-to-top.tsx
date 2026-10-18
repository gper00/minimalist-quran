"use client"

import { useEffect, useState, type RefObject } from "react"
import { ArrowUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAudio } from "@/hooks/use-audio"
import { useLanguage } from "@/hooks/use-language"
import { cn } from "@/lib/utils"

interface BackToTopProps {
  /** Scroll container to watch; when omitted the window is used. */
  targetRef?: RefObject<HTMLElement | null>
  /** How far (px) the reader must scroll before the button appears. */
  threshold?: number
}

export function BackToTop({ targetRef, threshold = 600 }: BackToTopProps) {
  const [visible, setVisible] = useState(false)
  // The mini player floats over the bottom edge too — lift the button above it.
  const { status } = useAudio()
  const { t } = useLanguage()
  const playerVisible = status !== "idle"

  useEffect(() => {
    const el = targetRef?.current

    const update = () => {
      const offset = el ? el.scrollTop : window.scrollY
      setVisible(offset > threshold)
    }

    update()
    const target: HTMLElement | Window = el ?? window
    target.addEventListener("scroll", update, { passive: true })
    return () => target.removeEventListener("scroll", update)
  }, [targetRef, threshold])

  const scrollToTop = () => {
    const el = targetRef?.current
    if (el) {
      el.scrollTo({ top: 0, behavior: "smooth" })
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={scrollToTop}
      aria-label={t("common.back_to_top")}
      title={t("common.back_to_top")}
      tabIndex={visible ? 0 : -1}
      className={cn(
        // Sits above the mobile bottom nav (and the mini player), lower-right corner of the reader.
        "fixed right-4 z-40 h-10 w-10 rounded-full border border-border/40 bg-background/80 text-muted-foreground shadow-lg backdrop-blur transition-all duration-300 hover:border-brand/30 hover:bg-brand/10 hover:text-brand md:right-6 md:bottom-8",
        playerVisible ? "bottom-44" : "bottom-20",
        visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-3 opacity-0"
      )}
    >
      <ArrowUp className="h-4 w-4" />
    </Button>
  )
}

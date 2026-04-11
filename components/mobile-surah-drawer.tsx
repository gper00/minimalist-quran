"use client"

import { useState } from "react"
import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from "@/components/ui/dialog"
import { SurahSidebar } from "./surah-sidebar"
import type { Surah } from "@/lib/types"

interface MobileSurahDrawerProps {
  surahs: Surah[]
}

export function MobileSurahDrawer({ surahs }: MobileSurahDrawerProps) {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="mb-4 rounded-xl flex items-center gap-2 border-border/50 hover:bg-primary/5 hover:text-primary transition-colors">
          <Menu className="w-4 h-4" />
          Daftar Surah
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md w-[95vw] h-[85vh] p-0 rounded-3xl overflow-hidden flex flex-col border border-border/40 bg-background/95 backdrop-blur-xl shadow-2xl">
        <DialogTitle className="sr-only">Daftar Surah</DialogTitle>
        <div className="flex-1 w-full overflow-hidden" onClick={(e) => {
          // If user clicked a Link, close the modal
          if ((e.target as HTMLElement).closest('a')) {
            setOpen(false)
          }
        }}>
          <SurahSidebar surahs={surahs} />
        </div>
      </DialogContent>
    </Dialog>
  )
}

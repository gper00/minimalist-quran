"use client"

import Link from "next/link"
import { ChevronLeft } from "lucide-react"
import { useLanguage } from "@/hooks/use-language"

interface ReaderBreadcrumbProps {
  surahName: string
}

// Client component because the page itself is a server component and cannot
// read the language stored on the client.
export function ReaderBreadcrumb({ surahName }: ReaderBreadcrumbProps) {
  const { t } = useLanguage()

  return (
    <div className="hidden md:flex items-center justify-between mb-6">
      <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground uppercase tracking-wide">
        <Link href="/" className="hover:text-primary transition-colors flex items-center gap-1 group">
          <ChevronLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
          {t("reader.home")}
        </Link>
        <span className="opacity-40">/</span>
        <span className="text-foreground">{surahName}</span>
      </div>
    </div>
  )
}

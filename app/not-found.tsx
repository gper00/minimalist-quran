"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Header } from "@/components/header"
import { useLanguage } from "@/hooks/use-language"

export default function NotFound() {
  const { t } = useLanguage()

  return (
    <div className="min-h-screen">
      <Header />

      <main className="container mx-auto px-4 py-12 max-w-2xl">
        <Card>
          <CardContent className="p-8 text-center">
            <h1 className="text-4xl font-bold text-foreground mb-4">404</h1>
            <h2 className="text-xl font-semibold text-foreground mb-4">{t("notfound.title")}</h2>
            <p className="text-muted-foreground mb-6">{t("notfound.description")}</p>
            <Button asChild>
              <Link href="/">{t("notfound.back")}</Link>
            </Button>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

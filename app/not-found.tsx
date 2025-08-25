import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Header } from "@/components/header"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-12 max-w-2xl">
        <Card>
          <CardContent className="p-8 text-center">
            <h1 className="text-4xl font-bold text-foreground mb-4">404</h1>
            <h2 className="text-xl font-semibold text-foreground mb-4">Halaman Tidak Ditemukan</h2>
            <p className="text-muted-foreground mb-6">Maaf, surah atau halaman yang Anda cari tidak dapat ditemukan.</p>
            <Button asChild>
              <Link href="/">Kembali ke Beranda</Link>
            </Button>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

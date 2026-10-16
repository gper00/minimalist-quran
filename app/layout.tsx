import type React from "react"
import type { Metadata, Viewport } from "next"
import { Geist } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { SettingsProvider } from "@/hooks/use-settings"
import { LanguageProvider } from "@/hooks/use-language"
import { AudioProvider } from "@/hooks/use-audio"
import { Toaster } from "@/components/ui/toaster"

import { GlobalAudioPlayer } from "@/components/global-audio-player"
import { MobileNav } from "@/components/mobile-nav"
import { getAllSurahs } from "@/lib/api"
import { ARABIC_FONT_MAP, LATIN_FONT_MAP } from "@/lib/fonts"
import { SITE_NAME, SITE_DESCRIPTION, SITE_URL } from "@/lib/site"

const geist = Geist({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-geist",
})

export const viewport: Viewport = {
  themeColor: "#007f51",
  width: "device-width",
  initialScale: 1,
  // No maximumScale: pinch-zoom must stay available (accessibility).
}

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  applicationName: SITE_NAME,
  title: {
    default: "Al-Quran Digital - Bacaan yang Khusyuk",
    template: "%s | Al-Quran Digital",
  },
  description: SITE_DESCRIPTION,
  keywords: ["Al-Quran", "Quran Digital", "Baca Quran Online", "Terjemahan Quran", "Tafsir", "Islamic App", "Murottal"],
  authors: [{ name: "Umam Alfarizi", url: "https://umamalfarizi.is-a.dev" }],
  creator: "Umam Alfarizi",
  publisher: SITE_NAME,
  category: "religion",
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: "Al-Quran Digital - Bacaan yang Khusyuk",
    description: SITE_DESCRIPTION,
    images: [{ url: "/icon-512x512.png", width: 512, height: 512, alt: SITE_NAME }],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description: "Bacaan Al-Quran yang khusyuk, jernih, dan penuh makna.",
    images: ["/icon-512x512.png"],
  },
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: SITE_NAME,
  },
  formatDetection: {
    telephone: false,
  },
  ...(process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
    ? { verification: { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION } }
    : {}),
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const surahs = await getAllSurahs()

  return (
    <html lang="id" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Amiri:ital,wght@0,400;0,700;1,400;1,700&family=Scheherazade+New:wght@400;700&family=Noto+Naskh+Arabic:wght@400;700&family=Lateef:wght@400;700&family=IBM+Plex+Sans+Arabic:wght@400;500;600;700&family=Work+Sans:wght@400;500;600;700&family=Open+Sans:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <style>{`
html {
  font-family: ${geist.style.fontFamily};
  --font-arabic: "Amiri";
  --font-latin: var(--font-geist), sans-serif;
  --font-sans: var(--font-latin);
  --font-body: var(--font-latin);
  --font-mono: ui-monospace, SFMono-Regular, "SF Mono", Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
}
        `}</style>
        <script dangerouslySetInnerHTML={{ __html: `
  (function() {
    try {
      var s = JSON.parse(localStorage.getItem('quran-settings') || '{}');
      var arabicMap = ${JSON.stringify(ARABIC_FONT_MAP)};
      var latinMap = ${JSON.stringify(LATIN_FONT_MAP)};
      if (s.arabicFont && arabicMap[s.arabicFont]) {
        document.documentElement.style.setProperty('--font-arabic', arabicMap[s.arabicFont]);
      }
      if (s.latinFont && latinMap[s.latinFont]) {
        document.documentElement.style.setProperty('--font-latin', latinMap[s.latinFont]);
      }
    } catch(e) {}
  })();
` }} />
      </head>
      <body className={`${geist.variable} antialiased`}>
        <div className="app-backdrop" aria-hidden="true" />
        <div className="relative z-10">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={true}
          themes={["light", "dark", "sepia"]}
          disableTransitionOnChange={false}
        >
          <LanguageProvider>
            <SettingsProvider>
              <AudioProvider>
                {children}

                <MobileNav surahs={surahs} />
                <GlobalAudioPlayer />
                <Toaster />
              </AudioProvider>
            </SettingsProvider>
          </LanguageProvider>
        </ThemeProvider>
        </div>
      </body>
    </html>
  )
}

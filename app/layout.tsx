import type React from "react"
import type { Metadata, Viewport } from "next"
import { Work_Sans, Open_Sans } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { SettingsProvider } from "@/hooks/use-settings"
import { LanguageProvider } from "@/hooks/use-language"
import { AudioProvider } from "@/hooks/use-audio"
import { Toaster } from "@/components/ui/toaster"

import { GlobalAudioPlayer } from "@/components/global-audio-player"

const workSans = Work_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-work-sans",
})

const openSans = Open_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-open-sans",
})

export const viewport: Viewport = {
  themeColor: "#0f172a",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
}

export const metadata: Metadata = {
  metadataBase: new URL('https://quran.umamalfarizi.is-a.dev'),
  title: {
    default: "Al-Quran Digital - Bacaan yang Khusyuk",
    template: "%s | Al-Quran Digital",
  },
  description: "Aplikasi Al-Quran digital minimalis untuk pengalaman membaca yang fokus dan khusyuk. Lengkap dengan terjemahan, tafsir, dan audio murottal.",
  keywords: ["Al-Quran", "Quran Digital", "Baca Quran Online", "Terjemahan Quran", "Tafsir", "Islamic App", "Murottal"],
  authors: [{ name: "Umam Alfarizi", url: "https://umamalfarizi.is-a.dev" }],
  creator: "Umam Alfarizi",
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: "https://quran.umamalfarizi.is-a.dev",
    siteName: "Al-Quran Digital",
    title: "Al-Quran Digital - Bacaan yang Khusyuk",
    description: "Aplikasi Al-Quran digital minimalis untuk pengalaman membaca yang fokus dan khusyuk.",
    images: [{ url: "/icon-512x512.png", width: 512, height: 512, alt: "Al-Quran Digital" }],
  },
  twitter: {
    card: "summary",
    title: "Al-Quran Digital",
    description: "Bacaan Al-Quran yang khusyuk, jernih, dan penuh makna.",
    images: ["/icon-512x512.png"],
  },
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Al-Quran Digital",
  },
  formatDetection: {
    telephone: false,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Amiri:ital,wght@0,400;0,700;1,400;1,700&family=Scheherazade+New:wght@400;700&family=Noto+Naskh+Arabic:wght@400;700&display=swap"
          rel="stylesheet"
        />
        <style>{`
html {
  font-family: ${openSans.style.fontFamily};
  --font-sans: "Work Sans", sans-serif;
  --font-body: "Open Sans", sans-serif;
  --font-arabic: "Amiri";
  --font-latin: "Work Sans", sans-serif;
  --font-mono: ui-monospace, SFMono-Regular, "SF Mono", Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
}
        `}</style>
        <script dangerouslySetInnerHTML={{ __html: `
  (function() {
    try {
      var s = JSON.parse(localStorage.getItem('quran-settings') || '{}');
      if (s.arabicFont) {
        var arabicMap = {
          'Amiri': '"Amiri"',
          'Scheherazade New': '"Scheherazade New"',
          'Noto Naskh Arabic': '"Noto Naskh Arabic"'
        };
        document.documentElement.style.setProperty('--font-arabic', arabicMap[s.arabicFont] || '"Amiri"');
      }
      if (s.latinFont) {
        var latinMap = {
          'Work Sans': '"Work Sans", sans-serif',
          'Open Sans': '"Open Sans", sans-serif'
        };
        document.documentElement.style.setProperty('--font-latin', latinMap[s.latinFont] || '"Work Sans", sans-serif');
      }
    } catch(e) {}
  })();
` }} />
      </head>
      <body className={`${workSans.variable} ${openSans.variable} antialiased`}>
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

                <GlobalAudioPlayer />
                <Toaster />
              </AudioProvider>
            </SettingsProvider>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

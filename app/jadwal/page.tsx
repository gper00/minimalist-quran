"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { QiblaCompass } from "@/components/qibla-compass"
import { MapPin, Loader2, Calendar, Clock } from "lucide-react"

interface PrayerTimes {
  Fajr: string
  Dhuhr: string
  Asr: string
  Maghrib: string
  Isha: string
}

export default function JadwalPage() {
  const [lat, setLat] = useState<number | null>(null)
  const [lng, setLng] = useState<number | null>(null)
  const [address, setAddress] = useState<string>("Mencari lokasi...")
  const [prayerTimes, setPrayerTimes] = useState<PrayerTimes | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const latitude = position.coords.latitude
          const longitude = position.coords.longitude
          setLat(latitude)
          setLng(longitude)

          try {
            // Fetch Prayer Times
            const date = new Date()
            const year = date.getFullYear()
            const month = date.getMonth() + 1
            const res = await fetch(`https://api.aladhan.com/v1/calendar/${year}/${month}?latitude=${latitude}&longitude=${longitude}&method=11`)
            const data = await res.json()
            
            if (data.code === 200) {
              const today = date.getDate() - 1 // 0-indexed array
              const timings = data.data[today].timings
              setPrayerTimes({
                Fajr: timings.Fajr.split(" ")[0],
                Dhuhr: timings.Dhuhr.split(" ")[0],
                Asr: timings.Asr.split(" ")[0],
                Maghrib: timings.Maghrib.split(" ")[0],
                Isha: timings.Isha.split(" ")[0],
              })
            }

            // Estimate City name using reverse geocoding API (free)
            const geoRes = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`)
            const geoData = await geoRes.json()
            if (geoData && geoData.address) {
              setAddress(geoData.address.city || geoData.address.town || geoData.address.village || geoData.address.county || "Lokasi Anda")
            } else {
              setAddress("Lokasi Terdeteksi")
            }

          } catch (e) {
            console.error("Failed to fetch location metadata:", e)
            setAddress("Gagal memuat alamat")
          } finally {
            setIsLoading(false)
          }
        },
        (error) => {
          console.error("Geolocation error:", error)
          setAddress("Akses Lokasi Ditolak")
          setIsLoading(false)
        },
        { enableHighAccuracy: true }
      )
    } else {
      setAddress("Geolocation tidak didukung")
      setIsLoading(false)
    }
  }, [])

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1 container mx-auto px-4 max-w-2xl py-8 pb-32">
        <div className="text-center space-y-2 mb-10 mt-6">
          <h1 className="text-3xl font-black tracking-tight flex items-center justify-center gap-2">
            <Clock className="w-8 h-8 text-primary" />
            Jadwal & Kiblat
          </h1>
          <p className="text-muted-foreground flex items-center justify-center gap-1.5 font-medium">
            <MapPin className="w-4 h-4" />
            {address}
          </p>
        </div>

        {isLoading ? (
          <div className="h-64 flex flex-col items-center justify-center gap-4 bg-muted/20 border border-border/40 rounded-3xl">
            <Loader2 className="w-10 h-10 animate-spin text-primary" />
            <p className="text-muted-foreground font-medium animate-pulse">Menghitung koordinat ruang...</p>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Prayer Times Grid */}
            <div className="bg-card border border-border/40 rounded-3xl p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-6 text-foreground font-bold border-b border-border/20 pb-4">
                <Calendar className="w-5 h-5 text-primary" />
                <h3>Waktu Sholat Hari Ini</h3>
              </div>

              {prayerTimes ? (
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  {[
                    { name: 'Subuh', time: prayerTimes.Fajr },
                    { name: 'Dzuhur', time: prayerTimes.Dhuhr },
                    { name: 'Ashar', time: prayerTimes.Asr },
                    { name: 'Maghrib', time: prayerTimes.Maghrib },
                    { name: 'Isya', time: prayerTimes.Isha }
                  ].map((p, i) => (
                    <div key={i} className="flex flex-col items-center p-3 rounded-2xl bg-muted/40 border border-border/20">
                      <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">{p.name}</span>
                      <span className="text-lg font-black text-foreground">{p.time}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center p-4 text-muted-foreground text-sm">
                  Tidak dapat memuat jadwal sholat. Pastikan lokasi aktif.
                </div>
              )}
            </div>

            {/* Qibla Compass */}
            <QiblaCompass latitude={lat} longitude={lng} />
          </div>
        )}
      </main>
    </div>
  )
}

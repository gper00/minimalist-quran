"use client"

import { useState, useEffect, useCallback } from "react"
import { Compass, AlertTriangle, Navigation, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"

function getQiblaDirection(userLat: number, userLng: number): number {
  const meccaLat = 21.422487;
  const meccaLng = 39.826206;
  const latRk = (userLat * Math.PI) / 180.0;
  const lonRk = (userLng * Math.PI) / 180.0;
  const meccaLatRk = (meccaLat * Math.PI) / 180.0;
  const meccaLngRk = (meccaLng * Math.PI) / 180.0;
  
  const y = Math.sin(meccaLngRk - lonRk);
  const x = Math.cos(latRk) * Math.tan(meccaLatRk) - Math.sin(latRk) * Math.cos(meccaLngRk - lonRk);
  let qiblaHeading = Math.atan2(y, x);
  qiblaHeading = (qiblaHeading * 180.0) / Math.PI;
  if (qiblaHeading < 0) qiblaHeading += 360.0;
  return qiblaHeading;
}

interface QiblaCompassProps {
  latitude: number | null
  longitude: number | null
}

export function QiblaCompass({ latitude, longitude }: QiblaCompassProps) {
  const [heading, setHeading] = useState<number | null>(null)
  const [qiblaHeading, setQiblaHeading] = useState<number | null>(null)
  const [permissionGranted, setPermissionGranted] = useState<boolean | null>(null)
  const [errorStatus, setErrorStatus] = useState<string | null>(null)

  useEffect(() => {
    if (latitude && longitude) {
      setQiblaHeading(getQiblaDirection(latitude, longitude))
    }
  }, [latitude, longitude])

  const requestPermissionAndListen = useCallback(async () => {
    // Check for iOS 13+ DeviceOrientationEvent permission
    if (typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
      try {
        const permissionState = await (DeviceOrientationEvent as any).requestPermission()
        if (permissionState === 'granted') {
          setPermissionGranted(true)
          startListening()
        } else {
          setPermissionGranted(false)
          setErrorStatus("Izin sensor kompas ditolak perangkat.")
        }
      } catch (error) {
        setPermissionGranted(false)
        setErrorStatus("Terjadi kesalahan saat memohon izin sensor.")
      }
    } else {
      // Non iOS 13+ devices
      setPermissionGranted(true)
      startListening()
    }
  }, [])

  const startListening = () => {
    if (window.DeviceOrientationEvent) {
      window.addEventListener("deviceorientationabsolute", handleOrientation, true)
      // Fallback for devices without absolute orientation event
      window.addEventListener("deviceorientation", handleOrientation, true)
    } else {
      setErrorStatus("Sensor orientasi kompas tidak didukung di perangkat ini.")
    }
  }

  const handleOrientation = (event: DeviceOrientationEvent) => {
    let compassHeading = null

    // webkitCompassHeading is absolute in iOS
    if ((event as any).webkitCompassHeading) {
      compassHeading = (event as any).webkitCompassHeading
    } else if (event.absolute === true && event.alpha !== null) {
      // Android
      compassHeading = 360 - event.alpha
    }

    if (compassHeading !== null) {
      setHeading(Math.floor(compassHeading))
    }
  }

  useEffect(() => {
    return () => {
      window.removeEventListener("deviceorientationabsolute", handleOrientation, true)
      window.removeEventListener("deviceorientation", handleOrientation, true)
    }
  }, [])

  if (!latitude || !longitude) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-muted/20 border border-border/40 rounded-3xl h-[340px] text-center">
        <MapPin className="w-12 h-12 text-muted-foreground/40 mb-4 animate-bounce" />
        <h3 className="text-lg font-bold">Mencari Lokasi...</h3>
        <p className="text-sm text-muted-foreground">Aktifkan GPS / Izin Lokasi untuk melihat jarum Kiblat</p>
      </div>
    )
  }

  if (permissionGranted === null) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-card border border-border/40 rounded-3xl h-[340px] text-center shadow-sm">
        <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6">
          <Compass className="w-10 h-10 text-primary" />
        </div>
        <h3 className="text-xl font-bold mb-2">Kompas Kiblat</h3>
        <p className="text-sm text-muted-foreground mb-6">Aplikasi memerlukan izin untuk membaca sensor magnetik dan arah gawai Anda.</p>
        <Button onClick={requestPermissionAndListen} className="rounded-full px-8 shadow-lg shadow-primary/20">
          Aktifkan Sensor Kompas
        </Button>
      </div>
    )
  }

  if (errorStatus || heading === null) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-rose-50/50 border border-rose-200/50 rounded-3xl h-[340px] text-center">
        <AlertTriangle className="w-10 h-10 text-rose-500 mb-4" />
        <h3 className="text-lg font-bold text-rose-700">Sensor Tidak Tersedia</h3>
        <p className="text-sm text-rose-600/80 mb-4">{errorStatus || "Menunggu sensor menangkap daya magnetik..."}</p>
        <p className="text-xs text-rose-600/60 font-medium">Coba gunakan perangkat HP untuk pengalaman ini</p>
      </div>
    )
  }

  const qiblaAngle = qiblaHeading!
  const rotationDevice = heading
  const finalPointerRotation = qiblaAngle - rotationDevice

  // Calculate distance margin logic (if users face mecca perfectly)
  const isFacingQibla = Math.abs(finalPointerRotation % 360) < 5 || Math.abs(finalPointerRotation % 360) > 355; 

  return (
    <div className="relative flex flex-col items-center justify-center p-6 bg-card border border-border/40 rounded-3xl overflow-hidden shadow-sm">
      <div className="absolute top-4 right-4 bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold font-mono">
        {Math.round(qiblaHeading!)}° Q
      </div>
      
      <div className="relative w-[280px] h-[280px] flex items-center justify-center mt-2">
        {/* Outer Ring */}
        <div className="absolute w-full h-full rounded-full border-4 border-muted flex items-center justify-center">
          <div className="absolute -top-6 text-sm font-bold text-muted-foreground">U</div>
          <div className="absolute -bottom-6 text-sm font-bold text-muted-foreground">S</div>
          <div className="absolute -left-6 text-sm font-bold text-muted-foreground">B</div>
          <div className="absolute -right-6 text-sm font-bold text-muted-foreground">T</div>
          
          {/* Degree Ticks */}
          {[...Array(36)].map((_, i) => (
             <div 
               key={i} 
               className="absolute w-0.5 h-full" 
               style={{ transform: `rotate(${i * 10}deg)` }}
             >
               <div className={`w-full ${i % 9 === 0 ? 'h-3 bg-primary/40' : 'h-1.5 bg-border'} rounded-full`} />
             </div>
          ))}
        </div>

        {/* Compass Rotating Body (North orientation) */}
        <div 
          className="absolute w-[240px] h-[240px] rounded-full flex items-center justify-center ease-out transition-transform duration-500" 
          style={{ transform: `rotate(${-rotationDevice}deg)` }}
        >
          {/* North needle */}
          <div className="absolute top-2 w-1 h-12 bg-rose-500 rounded-t-full shadow-md" />
          <div className="absolute bottom-2 w-1 h-12 bg-foreground/20 rounded-b-full shadow-md" />
        </div>

        {/* Qibla Needle (Floating Above) */}
        <div 
          className={`absolute w-[210px] h-[210px] flex items-center justify-center rounded-full ease-out transition-transform duration-700 ${isFacingQibla ? 'scale-110 drop-shadow-2xl' : ''}`}
          style={{ transform: `rotate(${finalPointerRotation}deg)` }}
        >
          {/* Dynamic Glow if precisely facing Qibla */}
          {isFacingQibla && (
             <div className="absolute inset-0 rounded-full bg-emerald-500/20 blur-xl animate-pulse" />
          )}
          
          <div className="absolute -top-2 flex flex-col items-center">
            {/* Kaaba Arrow Head */}
            <div className={`w-6 h-6 rotate-45 mb-1 ${isFacingQibla ? 'bg-emerald-500 border-emerald-400 shadow-emerald-500/50' : 'bg-primary border-primary/50 shadow-primary/30'} border-t-2 border-l-2 shadow-lg transition-colors duration-300`} />
            <div className={`w-1.5 h-[100px] rounded-full bg-gradient-to-t ${isFacingQibla ? 'from-emerald-500/0 to-emerald-500' : 'from-primary/0 to-primary'} opacity-80`} />
            <div className="mt-2 bg-background/80 backdrop-blur-sm px-2 py-1 rounded shadow text-[10px] font-bold text-foreground">
              KIBLAT
            </div>
          </div>
        </div>

        {/* Center Pivot */}
        <div className="relative w-4 h-4 bg-background border-2 border-primary rounded-full z-10 shadow-sm" />
      </div>

      <div className="mt-12 text-center">
        <h3 className={`text-2xl font-black mb-1 transition-colors ${isFacingQibla ? 'text-emerald-500' : 'text-foreground'}`}>
          {isFacingQibla ? "Sempurna!" : "Putar Perangkat Anda"}
        </h3>
        <p className="text-sm text-muted-foreground max-w-[200px] mx-auto">
          {isFacingQibla 
            ? "Anda telah menghadap arah Kiblat." 
            : "Sejajarkan jarum utama dengan ikon KIBLAT"
          }
        </p>
      </div>
    </div>
  )
}

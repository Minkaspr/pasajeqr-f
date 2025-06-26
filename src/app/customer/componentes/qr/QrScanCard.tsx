"use client"

import { useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Html5QrcodeScanner } from "html5-qrcode"

export function QrScanCard() {
  useEffect(() => {
    const scanner = new Html5QrcodeScanner(
      "qr-reader",
      { fps: 10, qrbox: 250 },
      false
    )

    scanner.render(
      (decodedText: string) => {
        alert(`Código escaneado: ${decodedText}`)
        scanner.clear().catch(console.error)
      },
      (errorMessage: string) => {
        console.warn("Escaneo fallido", errorMessage)
      }
    )

    return () => {
      scanner.clear().catch(console.error)
    }
  }, [])

  return (
    <Card className="p-4 bg-muted/50 flex flex-col items-center gap-2 w-full max-w-md">
      <p className="text-center text-muted-foreground text-sm">
        Apunta tu cámara al código QR del bus para pagar tu pasaje
      </p>
      <div id="qr-reader" className="w-full mt-2" />
    </Card>
  )
}

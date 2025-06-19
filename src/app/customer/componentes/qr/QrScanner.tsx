"use client"

import { useEffect, useState } from "react"
import { Html5Qrcode } from "html5-qrcode"
import { Card } from "@/components/ui/card"

interface QrScannerProps {
  scannerActive: boolean
  onResult: (result: string) => void
}

export function QrScanner({ scannerActive, onResult }: QrScannerProps) {
  const [html5QrCode, setHtml5QrCode] = useState<Html5Qrcode | null>(null)
  const [scanning, setScanning] = useState(false)

  useEffect(() => {
    if (scannerActive) {
      startScanner()
    } else {
      stopScanner()
    }

    return () => {
      stopScanner()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scannerActive])

  const startScanner = () => {
    if (scanning || html5QrCode?.isScanning) return

    const scanner = new Html5Qrcode("qr-reader")
    setHtml5QrCode(scanner)

    scanner
      .start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
        },
        (decodedText) => {
          onResult(decodedText)
          stopScanner(scanner)
        },
        (errorMessage) => {
          console.log(errorMessage)
        }
      )
      .then(() => setScanning(true))
      .catch((err) => console.error("Error al iniciar el escáner:", err))
  }

  const stopScanner = async (scanner?: Html5Qrcode) => {
    const qrScanner = scanner || html5QrCode
    if (qrScanner && qrScanner.isScanning) {
      try {
        await qrScanner.stop()
        setScanning(false)
      } catch (err) {
        console.error("Error al detener el escáner:", err)
      }
    }
  }

  return (
    <div className="space-y-4">
      <div id="qr-reader" className="w-full h-64 bg-muted/30 rounded-lg overflow-hidden" />

      <Card className="p-4 bg-muted/50 text-center">
        <p className="text-sm text-muted-foreground">
          Apunta la cámara al código QR del bus para realizar el pago
        </p>
      </Card>
    </div>
  )
}

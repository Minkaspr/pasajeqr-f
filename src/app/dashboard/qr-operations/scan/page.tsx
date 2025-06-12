"use client"

import { useEffect, useRef, useState } from "react"
import { Html5QrcodeScanner } from "html5-qrcode"

export default function ScanQRCodePage() {
  const [scannedResult, setScannedResult] = useState<string | null>(null)
  const scannerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const scanner = new Html5QrcodeScanner("reader", {
      fps: 10,
      qrbox: 250
    }, false)

    scanner.render(
      (decodedText) => {
        setScannedResult(decodedText)
        scanner.clear() // detener después del primer escaneo
      },
      (errorMessage) => {
        // puedes logear errores de escaneo si deseas
        console.warn("Scan error", errorMessage)
      }
    )

    return () => {
      scanner.clear().catch(() => {})
    }
  }, [])

  return (
    <div className="max-w-xl mx-auto py-10 px-4 space-y-6">
      <h1 className="text-2xl font-bold">Escanear QR</h1>

      {!scannedResult && <div id="reader" ref={scannerRef} />}

      {scannedResult && (
        <div className="bg-green-100 text-green-900 p-4 rounded shadow">
          <p className="font-medium">Código QR detectado:</p>
          <p className="break-all">{scannedResult}</p>
          {scannedResult.startsWith("http") && (
            <a
              href={scannedResult}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline mt-2 block"
            >
              Abrir enlace
            </a>
          )}
        </div>
      )}
    </div>
  )
}

import QRCodeStyling from "qr-code-styling"
import { BusFront } from "lucide-react"
import { renderToStaticMarkup } from "react-dom/server"
import { getTripQrToken } from "../lib/api"

export async function generateServiceQr(tripId: number, tripCode: string) {
  // 1. Obtener el token del backend
  const { data: token } = await getTripQrToken(tripId)
  // 2. Crear URL con token
  const baseUrl = `${window.location.origin}/scan?token=${token}`

  // 3. Crear el ícono SVG de Bus en string (usamos Lucide)
  const busIcon = encodeURIComponent(
    renderToStaticMarkup(<BusFront size={64} color="#000"/>)
  )
  const busIconUrl = `data:image/svg+xml,${busIcon}`

  // 4. Generar timestamp para nombre del archivo
  const now = new Date()
  const timestamp = now.toISOString().slice(0, 16).replace(/[-:T]/g, "")
  const fileName = `qr-${tripCode}-${timestamp}`

  // 5. Crear QR
  const qr = new QRCodeStyling({
    width: 600,
    height: 600,
    type: "canvas",
    data: baseUrl,
    image: busIconUrl,
    imageOptions: {
      margin: 2,
      crossOrigin: "anonymous",
    },
    dotsOptions: {
      color: "#000000",
      type: "dots",
    },
    backgroundOptions: {
      color: "#ffffff",
    },
    cornersSquareOptions: {
      color: "#000000",
      type: "extra-rounded",
    },
    cornersDotOptions: {
      color: "#000000",
      type: "extra-rounded",
    },
  })

  // 6. Descargar QR
  await qr.download({
    name: fileName,
    extension: "png",
  })
}

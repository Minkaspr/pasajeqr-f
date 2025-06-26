"use client"

import { useState } from "react"
import { useReceiptDownload } from "../../../../hooks/useReceiptDownload"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"

interface Props {
  transactionId: string
  userName: string
  userDni: string
  userEmail?: string
  amount: string // toFixed string
  previousBalance: number // number, no string
  newBalance: number // number, no string
  rechargeDate: Date
}

export function RechargeReceiptImage({
  transactionId,
  userName,
  userDni,
  userEmail = "sin-correo@transbus.pe",
  amount,
  previousBalance,
  newBalance,
  rechargeDate,
}: Props) {
  const [isDownloading, setIsDownloading] = useState(false)
  const { downloadReceipt } = useReceiptDownload()

  const handleDownload = async () => {
    setIsDownloading(true)

    try {
      await downloadReceipt({
        transactionId,
        userName,
        userDni,
        userEmail,
        date: rechargeDate,
        previousBalance, // <-- ya es number
        rechargeAmount: Number.parseFloat(amount), // solo este es string
        newBalance, // <-- ya es number
      })
    } catch (err) {
      console.error("Error al descargar comprobante", err)
      
    } finally {
      setIsDownloading(false)
    }
  }

  return (
    <Button onClick={handleDownload} variant="ghost" size="icon" className="text-green-700" disabled={isDownloading}>
      {isDownloading ? <Download className="h-5 w-5 animate-pulse" /> : <Download className="h-5 w-5" />}
      <span className="sr-only">{isDownloading ? "Descargando..." : "Descargar comprobante"}</span>
    </Button>
  )
}

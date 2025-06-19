"use client"

import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

type Props = {
  balance: number
  onScanClick?: () => void
}

export function BalanceCard({ balance, onScanClick }: Props) {
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-center text-lg md:text-xl">Saldo Actual</CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="text-center space-y-4">
          {/* Monto del saldo */}
          <div className="text-3xl font-bold">
            ${balance.toFixed(2)}
          </div>

          {/* Botón Escanear QR */}
          <Button 
            onClick={onScanClick}
            className="w-full h-10 text-sm"
          >
            Abrir Escáner QR
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

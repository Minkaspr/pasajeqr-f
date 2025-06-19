"use client"

import { CheckCircle2, Search } from "lucide-react"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { format } from "date-fns"
import { RechargeReceiptImage } from "./RechargeReceiptImage"

interface Props {
  transactionId: string
  userName: string
  userDni: string
  userEmail?: string
  amount: string // se mantiene string porque ya viene formateado (toFixed)
  previousBalance: number // CORREGIDO: antes era string
  newBalance: number // CORREGIDO: antes era string
  rechargeDate: Date
  onNewRecharge: () => void
}

export function RechargeReceipt({
  transactionId,
  userName,
  userDni,
  userEmail = "cliente@transbus.pe",
  amount,
  previousBalance,
  newBalance,
  rechargeDate,
  onNewRecharge,
}: Props) {
  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("es-PE", {
      style: "currency",
      currency: "PEN",
    }).format(value)

  return (
    <div className="space-y-6">
      <Card className="border-green-200 bg-green-50">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2 text-green-700">
              <CheckCircle2 className="h-5 w-5" />
              Recarga Exitosa
            </CardTitle>
            <RechargeReceiptImage
              transactionId={transactionId}
              userName={userName}
              userDni={userDni}
              userEmail={userEmail}
              amount={amount}
              previousBalance={previousBalance} // <-- SIN formatCurrency
              newBalance={newBalance}           // <-- SIN formatCurrency
              rechargeDate={rechargeDate}
            />
          </div>
          <CardDescription className="text-green-600">
            Comprobante de recarga
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="flex justify-center py-4">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle2 className="h-10 w-10 text-green-600" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Info label="Usuario" value={userName} />
            <Info label="DNI" value={userDni} />
            <Info
              label="Fecha y Hora"
              value={format(rechargeDate, "dd/MM/yyyy HH:mm")}
            />
          </div>

          <div className="border-t border-green-200 pt-6 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <AmountSummary
                label="Saldo Anterior"
                value={formatCurrency(previousBalance)}
              />
              <AmountSummary
                label="Monto Recargado"
                value={amount}
                highlight
              />
              <AmountSummary
                label="Nuevo Saldo"
                value={formatCurrency(newBalance)}
                large
              />
            </div>
          </div>
        </CardContent>

        <CardFooter className="bg-green-100 text-center text-sm text-green-700 py-3">
          <p className="w-full">
            Gracias por usar nuestro servicio de recargas • Conserve este
            comprobante
          </p>
        </CardFooter>
      </Card>

      <div className="flex justify-center">
        <Button
          onClick={onNewRecharge}
          variant="outline"
          size="lg"
          className="gap-2"
        >
          <Search className="h-4 w-4" />
          Realizar otra recarga
        </Button>
      </div>
    </div>
  )
}

function Info({
  label,
  value,
  mono = false,
}: {
  label: string
  value: string
  mono?: boolean
}) {
  return (
    <div className="space-y-1">
      <p className="text-sm text-green-700 font-medium">{label}</p>
      <p className={`font-semibold ${mono ? "font-mono text-sm" : ""}`}>{value}</p>
    </div>
  )
}

function AmountSummary({
  label,
  value,
  highlight = false,
  large = false,
}: {
  label: string
  value: string
  highlight?: boolean
  large?: boolean
}) {
  const sizeClass = large ? "text-2xl" : highlight ? "text-xl" : "text-lg"
  const colorClass = highlight ? "text-green-600" : "text-green-700"

  return (
    <div className="space-y-1">
      <p className="text-sm text-green-700 font-medium">{label}</p>
      <p className={`${sizeClass} font-bold ${colorClass}`}>
        {highlight ? `+${value}` : value}
      </p>
    </div>
  )
}

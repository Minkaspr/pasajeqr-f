"use client"

import { getStopsPaged } from "@/app/dashboard/stop/lib/api"
import { StopItemRS } from "@/app/dashboard/stop/types/stop"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { ArrowRight, Bus, CreditCard, Loader2, MapPin } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useSearchParams, useRouter } from "next/navigation"
import { useCallback, useEffect, useState } from "react"
import { toast } from "sonner"
import { FareItemRS } from "@/app/dashboard/fare/types/fare"
import { getFaresPaged } from "@/app/dashboard/fare/lib/api"
import { payPassengerFare } from "@/app/dashboard/balance-recharge/lib/api"
import { FarePaymentRQ } from "@/app/dashboard/balance-recharge/types/balance"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Separator } from "@radix-ui/react-select"

export default function AbordarPage() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const tripId = searchParams.get("tripId")
  const tripCode = searchParams.get("tripCode")
  const status = searchParams.get("status")

  const [stops, setStops] = useState<StopItemRS[]>([])
  const [originStopId, setOriginStopId] = useState<number | null>(null)
  const [destinationStopId, setDestinationStopId] = useState<number | null>(null)
  const [price, setPrice] = useState<string>("")
  const [loading, setLoading] = useState(false)
  const [fares, setFares] = useState<FareItemRS[]>([])
  const [paymentLoading, setPaymentLoading] = useState(false)

  // Redirección por parámetros inválidos o viaje terminado
  useEffect(() => {
    if (!tripId || !tripCode || !status) {
      router.replace("/scan")
      return
    }

    if (status === "COMPLETED" || status === "CANCELED") {
      router.replace("/scan")
    }
  }, [tripId, tripCode, status, router])

  // Cargar paraderos
  useEffect(() => {
    const fetchStops = async () => {
      setLoading(true) // 👈 AÑADIR AQUÍ
      try {
        const res = await getStopsPaged(0, 100)
        setStops(res.data?.stops ?? [])
      } catch (err) {
        toast.error("Error al cargar paraderos")
        console.error(err)
      } finally {
        setLoading(false) // 👈 Y AQUÍ
      }
    }

    fetchStops()
  }, [])

  // Obtener tarifa desde mock
  useEffect(() => {
    const fetchFares = async () => {
      try {
        const res = await getFaresPaged(0, 100) // trae hasta 100 tarifas
        setFares(res.data?.fares ?? [])
      } catch (err) {
        toast.error("Error al cargar tarifas")
        console.error(err)
      }
    }

    fetchFares()
  }, [])

  useEffect(() => {
    if (originStopId && destinationStopId) {
      const code1 = `${originStopId}-${destinationStopId}`
      const code2 = `${destinationStopId}-${originStopId}`

      const fare = fares.find(f => f.code === code1 || f.code === code2)

      if (fare) {
        setPrice(fare.price.toFixed(2))
      } else {
        setPrice("")
        toast.warning("No hay una tarifa definida entre esos paraderos.")
      }
    } else {
      setPrice("")
    }
  }, [originStopId, destinationStopId, fares])

  const getStopName = useCallback(
    (id: number) => stops.find((s) => s.id === id)?.name || "",
    [stops]
  )

  const handlePay = async () => {
    if (!originStopId || !destinationStopId || !price) {
      console.warn("❌ Campos incompletos:", { originStopId, destinationStopId, price })
      toast.warning("Completa todos los campos para continuar")
      return
    }
    setPaymentLoading(true)
    try {
      const paymentData: FarePaymentRQ = {
        amount: parseFloat(price),
        description: `Pago por viaje de ${getStopName(originStopId)} a ${getStopName(destinationStopId)}`,
      }
      console.log("📤 Enviando:", JSON.stringify(paymentData, null, 2))
      const storedUser = localStorage.getItem("user")
      if (!storedUser) {
        toast.error("No se encontró el usuario en localStorage")
        return
      }

      const parsedUser = JSON.parse(storedUser)
      const passengerId = parsedUser.id
      const response = await payPassengerFare(passengerId, paymentData)

      console.log("✅ Transacción registrada:", response.data)

      toast.success("Pago realizado con éxito")
      router.push("/customer")
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("❌ Error al pagar tarifa:", error)
        toast.error(error.message || "Ocurrió un error al procesar el pago")
      } else {
        toast.error("Error inesperado")
      }
    } finally {
      setPaymentLoading(false)
    }
  }


  const handleCancel = () => {
    router.replace("/customer")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 flex items-center justify-center">
      <div className="w-full max-w-md">
        <Card className="shadow-xl border-0">
          <CardHeader className="text-center space-y-4 pb-6">
            <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
              <Bus className="w-8 h-8 text-blue-600" />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold text-gray-900">Abordar Viaje</CardTitle>
              <CardDescription className="text-gray-600 mt-2">Selecciona tu ruta y confirma el pago</CardDescription>
            </div>

            {/* Información del viaje */}
            <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
              <div className="flex items-center justify-center gap-2">
                <Badge variant="secondary" className="bg-blue-100 text-blue-800 hover:bg-blue-100">
                  <Bus className="w-3 h-3 mr-1" />
                  {tripCode}
                </Badge>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Selección de Origen */}
            <div className="space-y-3">
              <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-green-600" />
                Paradero de Origen
              </Label>
              <Select
                value={originStopId?.toString() || ""}
                onValueChange={(value) => setOriginStopId(Number(value))}
                disabled={loading}
              >
                <SelectTrigger className="h-12 border-2 border-gray-200 hover:border-gray-300 focus:border-blue-500 transition-colors">
                  <SelectValue placeholder="Selecciona el origen" />
                </SelectTrigger>
                <SelectContent className="max-w-lg">
                  {stops
                    .filter((s) => s.id !== destinationStopId)
                    .map((s) => (
                      <SelectItem key={s.id} value={s.id.toString()}>
                        {s.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            {/* Selección de Destino */}
            <div className="space-y-3">
              <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-red-600" />
                Paradero de Destino
              </Label>
              <Select
                value={destinationStopId?.toString() || ""}
                onValueChange={(value) => setDestinationStopId(Number(value))}
                disabled={loading}
              >
                <SelectTrigger className="h-12 border-2 border-gray-200 hover:border-gray-300 focus:border-blue-500 transition-colors">
                  <SelectValue placeholder="Selecciona el destino" />
                </SelectTrigger>
                <SelectContent className="max-w-lg">
                  {stops
                    .filter((s) => s.id !== originStopId)
                    .map((s) => (
                      <SelectItem key={s.id} value={s.id.toString()}>
                        {s.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            {/* Vista previa del viaje */}
            {originStopId && destinationStopId && (
              <>
                <Separator className="my-6" />
                <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-4 border border-gray-200">
                  <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                    <Bus className="w-4 h-4" />
                    Resumen del Viaje
                  </h3>

                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <div className="w-3 h-3 bg-green-500 rounded-full flex-shrink-0"></div>
                        <span className="text-sm font-medium text-gray-900 truncate">{getStopName(originStopId)}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-center">
                      <ArrowRight className="w-5 h-5 text-blue-600" />
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <div className="w-3 h-3 bg-red-500 rounded-full flex-shrink-0"></div>
                        <span className="text-sm font-medium text-gray-900 truncate">
                          {getStopName(destinationStopId)}
                        </span>
                      </div>
                    </div>

                    {price && (
                      <>
                        <Separator className="my-3" />
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-700">Total a pagar:</span>
                          <div className="flex items-center gap-1">
                            <CreditCard className="w-4 h-4 text-green-600" />
                            <span className="text-lg font-bold text-green-600">S/ {price}</span>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </>
            )}

            {/* Botones de acción */}
            <div className="flex gap-3 pt-4">
              <Button
                variant="outline"
                onClick={handleCancel}
                className="flex-1 h-12 border-2 hover:bg-gray-50 bg-transparent"
                disabled={paymentLoading}
              >
                Cancelar
              </Button>
              <Button
                onClick={handlePay}
                disabled={!originStopId || !destinationStopId || !price || loading || paymentLoading}
                className="flex-1 h-12 bg-blue-600 hover:bg-blue-700 text-white font-semibold"
              >
                {paymentLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Procesando...
                  </>
                ) : (
                  <>
                    <CreditCard className="w-4 h-4 mr-2" />
                    Pagar
                  </>
                )}
              </Button>
            </div>

            {/* Estado de carga */}
            {loading && (
              <div className="flex items-center justify-center py-4">
                <Loader2 className="w-5 h-5 animate-spin text-blue-600 mr-2" />
                <span className="text-sm text-gray-600">Cargando paraderos...</span>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

"use client"

import { useCallback, useEffect, useState } from "react"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowRight } from "lucide-react"
import { FieldError } from "@/components/field-error"
import { getStopsPaged } from "../../stop/lib/api"
import { StopItemRS } from "../../stop/types/stop"
import { getFareById, updateFare, createFare } from "../lib/api"
import { fareUpdateSchema, fareCreateSchema, FareCreateRQ, FareUpdateRQ } from "../types/fare.schemas"
import { toast } from "sonner"

interface FareDialogProps {
  fareId: number | null
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export function FareDialog({ fareId, isOpen, onClose, onSuccess }: FareDialogProps) {
  const isEdit = fareId !== null

  // 🧠 Estados del formulario
  const [originStopId, setOriginStopId] = useState<number | null>(null)
  const [destinationStopId, setDestinationStopId] = useState<number | null>(null)
  const [price, setPrice] = useState("")
  const [stops, setStops] = useState<StopItemRS[]>([])

  // 👀 Control de errores y campos tocados
  const [errors, setErrors] = useState<{ originStopId?: string; destinationStopId?: string; price?: string }>({})
  const [touched, setTouched] = useState({ originStopId: false, destinationStopId: false, price: false })

  const [loading, setLoading] = useState(false)
  const [formKey, setFormKey] = useState(0)

  // ✅ Validación reactiva
  const validate = useCallback(() => {
    const schema = isEdit ? fareUpdateSchema : fareCreateSchema

    const result = schema.safeParse({
      originStopId: originStopId ?? 0,
      destinationStopId: destinationStopId ?? 0,
      price: price.trim() === "" ? undefined : parseFloat(price)
    })

    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors
      setErrors({
        originStopId: fieldErrors.originStopId?.[0],
        destinationStopId: fieldErrors.destinationStopId?.[0],
        price: fieldErrors.price?.[0]
      })
      return false
    }

    setErrors({})
    return true
  }, [originStopId, destinationStopId, price, isEdit])

  // 📦 Cargar datos al abrir
  useEffect(() => {
    if (!isOpen) return

    const fetchData = async () => {
      setLoading(true)
      try {
        const resStops = await getStopsPaged(0, 100)
        setStops(resStops.data?.stops ?? [])

        if (isEdit && fareId !== null) {
          const resFare = await getFareById(fareId)
          const fare = resFare.data
          if (fare) {
            setOriginStopId(fare.originStopId)
            setDestinationStopId(fare.destinationStopId)
            setPrice(fare.price.toString())
          }
        }
      } catch (err) {
        console.error("❌ Error cargando datos:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [isOpen, fareId, isEdit])

  // 🧼 Resetear estados al cerrar
  useEffect(() => {
    if (!isOpen) {
      setOriginStopId(null)
      setDestinationStopId(null)
      setPrice("")
      setErrors({})
      setTouched({ originStopId: false, destinationStopId: false, price: false })
      setFormKey((prev) => prev + 1)
    }
  }, [isOpen])

  // 🟡 Validación reactiva si se tocó algún campo
  useEffect(() => {
    if (touched.originStopId || touched.destinationStopId || touched.price) {
      validate()
    }
  }, [originStopId, destinationStopId, price, touched, validate])

  // 📨 Envío de formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    setTouched({ originStopId: true, destinationStopId: true, price: true })
    const isValid = validate()
    if (!isValid) return

    try {
      setLoading(true)

      const payload = {
        originStopId: originStopId!,
        destinationStopId: destinationStopId!,
        price: parseFloat(price),
        code: `${originStopId}-${destinationStopId}`
      }
      console.log("🚀 Payload que se enviará:", JSON.stringify(payload, null, 2))

      if (isEdit) {
        await updateFare(fareId!, payload as FareUpdateRQ)
      } else {
        await createFare(payload as FareCreateRQ)
      }

      onSuccess()
      onClose()
    }  catch (error: unknown) {
      console.error("❌ Error al guardar tarifa:", error)
      const message =
        error instanceof Error ? error.message : "Error desconocido al guardar la tarifa"

      if (message.includes("duplicado")) {
        toast.error("Ya existe una tarifa entre estos dos paraderos.")
      } else {
        toast.error("Ocurrió un error al guardar la tarifa.")
      }
    } finally {
      setLoading(false)
    }
  }

  const getStopName = (id: number) => stops.find((s) => s.id === id)?.name || ""

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent key={formKey} className="max-w-lg w-full mx-4">
        <DialogHeader className="pb-4">
          <DialogTitle className="text-lg font-semibold">{isEdit ? "Editar Tarifa" : "Nueva Tarifa"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 overflow-hidden">
          {/* Paradero de Origen */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Paradero de Origen</Label>
            <Select
              value={originStopId?.toString() || ""}
              onValueChange={(value) => {
                setOriginStopId(Number(value))
                setTouched((prev) => ({ ...prev, originStopId: true }))
              }}
              disabled={loading}
            >
              <SelectTrigger
                className={`h-10 min-w-0 ${errors.originStopId && touched.originStopId ? "border-red-500" : ""}`}
              >
                <SelectValue placeholder="Selecciona el origen" className="truncate text-left" />
              </SelectTrigger>
              <SelectContent className="max-w-[calc(100vw-2rem)] sm:max-w-lg">
                {stops
                  .filter((s) => s.id !== destinationStopId)
                  .map((s) => (
                    <SelectItem key={s.id} value={s.id.toString()}>
                      <div className="truncate max-w-full" title={s.name}>
                        {s.name}
                      </div>
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
            <FieldError show={!!errors.originStopId && touched.originStopId} message={errors.originStopId} />
          </div>

          {/* Paradero de Destino */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Paradero de Destino</Label>
            <Select
              value={destinationStopId?.toString() || ""}
              onValueChange={(value) => {
                setDestinationStopId(Number(value))
                setTouched((prev) => ({ ...prev, destinationStopId: true }))
              }}
              disabled={loading}
            >
              <SelectTrigger
                className={`h-10 min-w-0 ${
                  errors.destinationStopId && touched.destinationStopId ? "border-red-500" : ""
                }`}
              >
                <SelectValue placeholder="Selecciona el destino" className="truncate text-left" />
              </SelectTrigger>
              <SelectContent className="max-w-[calc(100vw-2rem)] sm:max-w-lg">
                {stops
                  .filter((s) => s.id !== originStopId)
                  .map((s) => (
                    <SelectItem key={s.id} value={s.id.toString()}>
                      <div className="truncate max-w-full" title={s.name}>
                        {s.name}
                      </div>
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
            <FieldError
              show={!!errors.destinationStopId && touched.destinationStopId}
              message={errors.destinationStopId}
            />
          </div>

          {/* Precio */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Precio</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground pointer-events-none z-10">
                S/
              </span>
              <Input
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
                value={price}
                onChange={(e) => {
                  setPrice(e.target.value)
                  setTouched((prev) => ({ ...prev, price: true }))
                }}
                disabled={loading}
                className={`pl-10 h-10 min-w-0 ${errors.price && touched.price ? "border-red-500" : ""}`}
              />
            </div>
            <FieldError show={!!errors.price && touched.price} message={errors.price} />
          </div>

          {/* Vista previa */}
          {originStopId && destinationStopId && (
            <div className="p-3 bg-muted rounded-md min-w-0">
              <p className="text-sm text-muted-foreground mb-2">Vista previa:</p>
              <div className="flex items-center gap-2 text-sm font-medium min-w-0">
                <span title={getStopName(originStopId)} className="truncate flex-1 min-w-0">
                  {getStopName(originStopId)}
                </span>
                <ArrowRight className="h-4 w-4 text-primary shrink-0" />
                <span title={getStopName(destinationStopId)} className="truncate flex-1 min-w-0">
                  {getStopName(destinationStopId)}
                </span>
                {price && (
                  <>
                    <span className="text-muted-foreground shrink-0">•</span>
                    <span className="text-primary shrink-0 font-semibold">S/ {Number(price).toFixed(2)}</span>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Botones */}
          <DialogFooter className="pt-4 gap-2 sm:gap-0">
            <Button type="button" variant="ghost" onClick={onClose} disabled={loading} className="min-w-0">
              Cancelar
            </Button>
            <Button type="submit" disabled={loading || Object.values(errors).some(Boolean)} className="min-w-0">
              {loading ? "Guardando..." : isEdit ? "Actualizar" : "Crear"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>

  )
}

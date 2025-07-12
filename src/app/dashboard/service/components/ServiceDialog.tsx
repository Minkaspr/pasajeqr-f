"use client"

import { useCallback, useEffect, useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ServiceStatus, statusConfig } from "../types/status-config"
import { ArrowRight } from "lucide-react"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"

import { getBusesPaged } from "../../bus/lib/api"
import { BusItemRS, BusStatus } from "../../bus/types/bus"
import { getStopsPaged } from "../../stop/lib/api"
import { StopItemRS } from "../../stop/types/stop"
import { getAvailableDrivers } from "../../user/driver/lib/api"
import { AvailableDriverRS } from "@/types/driver"
import { createTrip, getTripById, updateTrip } from "../lib/api"
import { tripUpdateSchema, tripCreateSchema, TripUpdateRQ, TripCreateRQ } from "../types/service.schemas"

import styles from "../styles/ServiceDialog.module.css"

interface ServiceDialogProps {
  serviceId: number | null
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export function ServiceDialog({ serviceId, isOpen, onClose, onSuccess }: ServiceDialogProps) {
  const isEdit = serviceId !== null

  // Estados de formulario
  const [busId, setBusId] = useState<number | null>(null)
  const [driverId, setDriverId] = useState<number | null>(null)
  const [originStopId, setOriginStopId] = useState<number | null>(null)
  const [destinationStopId, setDestinationStopId] = useState<number | null>(null)
  const [departureDate, setDepartureDate] = useState("")
  const [departureTime, setDepartureTime] = useState("")
  const [arrivalDate, setArrivalDate] = useState("")
  const [arrivalTime, setArrivalTime] = useState("")
  const [status, setStatus] = useState("SCHEDULED")

  // Auxiliares
  const [buses, setBuses] = useState<BusItemRS[]>([])
  const [drivers, setDrivers] = useState<AvailableDriverRS[]>([])
  const [stops, setStops] = useState<StopItemRS[]>([])
  const [loading, setLoading] = useState(false)
  const [formKey, setFormKey] = useState(0)
  const [errors, setErrors] = useState<{ [key: string]: string | undefined }>({})
  const [code, setCode] = useState("")
  const [touched, setTouched] = useState({
    code: false,
    busId: false,
    driverId: false,
    originStopId: false,
    destinationStopId: false,
    departureDate: false,
    departureTime: false,
    arrivalDate: false,
    arrivalTime: false,
    status: false,
  })

  // 🧼 Reset completo del formulario
  const resetForm = () => {
    setBusId(null)
    setDriverId(null)
    setOriginStopId(null)
    setDestinationStopId(null)
    setDepartureDate("")
    setDepartureTime("")
    setArrivalDate("")
    setArrivalTime("")
    setStatus(ServiceStatus.SCHEDULED)
    setErrors({})
    setCode("")
    setTouched({
      code: false,
      busId: false,
      driverId: false,
      originStopId: false,
      destinationStopId: false,
      departureDate: false,
      departureTime: false,
      arrivalDate: false,
      arrivalTime: false,
      status: false,
    })
  }

  // Reset al cerrar modal
  useEffect(() => {
    if (!isOpen) {
      resetForm()
      setFormKey((prev) => prev + 1)
    }
  }, [isOpen])

  // Validación
  const validate = useCallback(() => {
    const schema = isEdit ? tripUpdateSchema : tripCreateSchema

    const payload = {
      ...(isEdit && { code }),
      busId,
      driverId,
      originStopId,
      destinationStopId,
      departureDate,
      departureTime,
      arrivalDate: arrivalDate || undefined,
      arrivalTime: arrivalTime || undefined,
      status,
    }

    const result = schema.safeParse(payload)

    if (!result.success) {
      const newErrors: { [key: string]: string } = {}

      result.error.errors.forEach((error) => {
        const field = error.path[0] as string
        if (field && !newErrors[field]) {
          newErrors[field] = error.message
        }
      })

      setErrors(newErrors)
      return false
    }

    setErrors({})
    return true
  }, [
    busId,
    driverId,
    originStopId,
    destinationStopId,
    departureDate,
    departureTime,
    arrivalDate,
    arrivalTime,
    status,
    code,
    isEdit,
  ])

  // Cargar datos
  useEffect(() => {
    if (!isOpen) return

    const fetchData = async () => {
      setLoading(true)
      try {
        const [{ data: busData }, driverData, { data: stopData }] = await Promise.all([
          getBusesPaged(0, 100),
          getAvailableDrivers(0, 100),
          getStopsPaged(0, 100),
        ])

        setBuses(busData?.buses ?? [])
        setDrivers(driverData?.data?.drivers ?? [])
        setStops(stopData?.stops ?? [])

        if (isEdit && serviceId != null) {
          const { data } = await getTripById(serviceId)
          if (!data) throw new Error("No se encontró el servicio")

          setCode(data.code ?? "")
          setBusId(data.busId)
          setDriverId(data.driverId)
          setOriginStopId(data.originStopId)
          setDestinationStopId(data.destinationStopId)
          setDepartureDate(data.departureDate)
          setDepartureTime(data.departureTime.slice(0, 5))
          setArrivalDate(data.arrivalDate ?? "")
          setArrivalTime(data.arrivalTime?.slice(0, 5) ?? "")
          setStatus(data.status ?? ServiceStatus.SCHEDULED)
        }
      } catch (err) {
        console.error("❌ Error cargando datos del servicio:", err)
        toast.error("Error al cargar datos del servicio")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [isOpen, serviceId, isEdit])

  // Validación reactiva
  useEffect(() => {
    if (Object.values(touched).some(Boolean)) {
      validate()
    }
  }, [busId, driverId, originStopId, destinationStopId, departureDate, departureTime, arrivalDate, arrivalTime, status, touched, validate])

  // Función helper para marcar campo como tocado
  const markTouched = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }))
  }

  // Envío
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setTouched({
      code: true,
      busId: true,
      driverId: true,
      originStopId: true,
      destinationStopId: true,
      departureDate: true,
      departureTime: true,
      arrivalDate: true,
      arrivalTime: true,
      status: true,
    })

    const payload = {
      ...(isEdit ? { code } : {}),
      busId: busId!,
      driverId: driverId!,
      originStopId: originStopId!,
      destinationStopId: destinationStopId!,
      departureDate,
      departureTime,
      arrivalDate: arrivalDate || undefined,
      arrivalTime: arrivalTime || undefined,
      status,
    }

    const schema = isEdit ? tripUpdateSchema : tripCreateSchema
    const result = schema.safeParse(payload)
    if (!result.success) {
      toast.error("Datos inválidos, revisa los campos")
      console.error(result.error.flatten())
      return
    }

    try {
      setLoading(true)
      if (isEdit) {
        await updateTrip(serviceId!, result.data as TripUpdateRQ)
      } else {
        await createTrip(result.data as TripCreateRQ)
      }

      onSuccess()
      onClose()
    } catch (error) {
      console.error("❌ Error al guardar servicio:", error)
      toast.error("Error al guardar servicio")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent key={formKey} className={`${styles.hoverScrollbar} max-w-xl max-h-[90vh] overflow-y-auto`}>
        <DialogHeader>
          <DialogTitle>{isEdit ? "Editar Servicio" : "Nuevo Servicio"}</DialogTitle>
          <DialogDescription>Completa los campos para registrar el servicio.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Código (solo en edición) */}
          {isEdit && (
            <div className="space-y-2">
              <Label>Código del Servicio *</Label>
              <Input
                value={code}
                disabled 
                onChange={(e) => {
                  setCode(e.target.value)
                  markTouched("code")
                }}
                placeholder="Código del servicio"
              />
              {errors.code && touched.code && <p className="text-sm text-red-500">{errors.code}</p>}
            </div>
          )}

          {/* Bus */}
          <div className="space-y-2">
            <Label>Bus *</Label>
            <Select
              value={busId?.toString() || ""}
              onValueChange={(val) => {
                setBusId(Number(val))
                markTouched("busId")
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecciona un bus" />
              </SelectTrigger>
              <SelectContent>
                {buses
                  .filter((b) => b.status === BusStatus.OPERATIONAL)
                  .map((b) => (
                  <SelectItem key={b.id} value={b.id.toString()}>
                    {b.plate}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.busId && touched.busId && <p className="text-sm text-red-500">{errors.busId}</p>}
          </div>

          {/* Conductor */}
          <div className="space-y-2">
            <Label>Conductor *</Label>
            <Select
              value={driverId?.toString() || ""}
              onValueChange={(val) => {
                setDriverId(Number(val))
                markTouched("driverId")
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecciona un conductor" />
              </SelectTrigger>
              <SelectContent>
                {drivers.map((d) => (
                  <SelectItem key={d.id} value={d.id.toString()}>
                    {`${d.firstName} ${d.lastName}`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.driverId && touched.driverId && <p className="text-sm text-red-500">{errors.driverId}</p>}
          </div>

          {/* Origen - Destino */}
          <div className="flex gap-4">
            <div className="flex-1 space-y-2">
              <Label>Origen *</Label>
              <Select
                value={originStopId?.toString() || ""}
                onValueChange={(val) => {
                  setOriginStopId(Number(val))
                  markTouched("originStopId")
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Paradero de origen" />
                </SelectTrigger>
                <SelectContent>
                  {stops
                    .filter((s) => s.id !== destinationStopId)
                    .map((s) => (
                      <SelectItem key={s.id} value={s.id.toString()}>
                        {s.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
              {errors.originStopId && touched.originStopId && (
                <p className="text-sm text-red-500">{errors.originStopId}</p>
              )}
            </div>

            <div className="flex items-center justify-center">
              <ArrowRight />
            </div>

            <div className="flex-1 space-y-2">
              <Label>Destino *</Label>
              <Select
                value={destinationStopId?.toString() || ""}
                onValueChange={(val) => {
                  setDestinationStopId(Number(val))
                  markTouched("destinationStopId")
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Paradero de destino" />
                </SelectTrigger>
                <SelectContent>
                  {stops
                    .filter((s) => s.id !== originStopId)
                    .map((s) => (
                      <SelectItem key={s.id} value={s.id.toString()}>
                        {s.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
              {errors.destinationStopId && touched.destinationStopId && (
                <p className="text-sm text-red-500">{errors.destinationStopId}</p>
              )}
            </div>
          </div>

          {/* Fechas y horas */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Fecha Salida *</Label>
              <Input
                type="date"
                value={departureDate}
                onChange={(e) => {
                  setDepartureDate(e.target.value)
                  markTouched("departureDate")
                }}
              />
              {errors.departureDate && touched.departureDate && (
                <p className="text-sm text-red-500">{errors.departureDate}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Hora Salida *</Label>
              <Input
                type="time"
                value={departureTime}
                onChange={(e) => {
                  setDepartureTime(e.target.value)
                  markTouched("departureTime")
                }}
              />
              {errors.departureTime && touched.departureTime && (
                <p className="text-sm text-red-500">{errors.departureTime}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Fecha Llegada (Opcional)</Label>
              <Input
                type="date"
                value={arrivalDate}
                onChange={(e) => {
                  setArrivalDate(e.target.value)
                  markTouched("arrivalDate")
                }}
              />
              {errors.arrivalDate && touched.arrivalDate && (
                <p className="text-sm text-red-500">{errors.arrivalDate}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Hora Llegada (Opcional)</Label>
              <Input
                type="time"
                value={arrivalTime}
                onChange={(e) => {
                  setArrivalTime(e.target.value)
                  markTouched("arrivalTime")
                }}
              />
              {errors.arrivalTime && touched.arrivalTime && (
                <p className="text-sm text-red-500">{errors.arrivalTime}</p>
              )}
            </div>

            {/* Estado */}          
            <div className="space-y-2">
              <Label>Estado</Label>
              <Select value={status} onValueChange={(val) => {
                setStatus(val)
                markTouched("status")
              }}>
                <SelectTrigger><SelectValue placeholder="Selecciona estado" /></SelectTrigger>
                <SelectContent>
                  {Object.entries(statusConfig).map(([key, conf]) => (<SelectItem key={key} value={key}>{conf.label}</SelectItem>))}
                </SelectContent>            
              </Select>
              {errors.status && touched.status && <p className="text-sm text-red-500">{errors.status}</p>}
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button type="button" variant="ghost" onClick={onClose} disabled={loading}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Guardando..." : isEdit ? "Actualizar" : "Registrar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
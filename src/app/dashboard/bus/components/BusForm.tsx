"use client"

import { useCallback, useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { FieldError } from "@/components/field-error"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { getBusById, updateBus, createBus } from "../lib/api"
import { busUpdateSchema, busCreateSchema, BusUpdateRQ, BusCreateRQ } from "../types/bus.schema"
import { BusStatus } from "../types/bus"
import { statusConfig } from "../utils"


interface BusFormProps {
  busId: number | null
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export function BusForm({ busId, isOpen, onClose, onSuccess }: BusFormProps) {
  const isEdit = busId !== null

  const [plate, setPlate] = useState("")
  const [model, setModel] = useState("")
  const [capacity, setCapacity] = useState(20)
  const [status, setStatus] = useState<BusStatus>(BusStatus.OPERATIONAL)

  const [errors, setErrors] = useState<{ plate?: string; model?: string; capacity?: string; status?: string }>({})
  const [touched, setTouched] = useState({ plate: false, model: false, capacity: false, status: false })
  const [loading, setLoading] = useState(false)
  const [formKey, setFormKey] = useState(0)

  // Validación reactiva
  const validate = useCallback(() => {
    const schema = isEdit ? busUpdateSchema : busCreateSchema
    const result = schema.safeParse({ plate, model, capacity, status })

    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors
      setErrors({
        plate: fieldErrors.plate?.[0],
        model: fieldErrors.model?.[0],
        capacity: fieldErrors.capacity?.[0],
        status: fieldErrors.status?.[0],
      })
      return false
    }

    setErrors({})
    return true
  }, [plate, model, capacity, status, isEdit])

  // Cargar datos
  useEffect(() => {
    if (!isOpen) return

    const fetchData = async () => {
      setLoading(true)
      try {
        if (isEdit && busId !== null) {
          const res = await getBusById(busId)
          const bus = res.data
          if (bus) {
            setPlate(bus.plate)
            setModel(bus.model)
            setCapacity(bus.capacity)
            setStatus(bus.status as BusStatus)
          }
        }
      } catch (err) {
        console.error("❌ Error cargando bus:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [isOpen, busId, isEdit])

  // Reset al cerrar
  useEffect(() => {
    if (!isOpen) {
      setPlate("")
      setModel("")
      setCapacity(20)
      setStatus(BusStatus.OPERATIONAL)
      setErrors({})
      setTouched({ plate: false, model: false, capacity: false, status: false })
      setFormKey((prev) => prev + 1)
    }
  }, [isOpen])

  // Validación reactiva si se tocó algo
  useEffect(() => {
    if (touched.plate || touched.model || touched.capacity || touched.status) {
      validate()
    }
  }, [plate, model, capacity, status, touched, validate])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setTouched({ plate: true, model: true, capacity: true, status: true })

    if (!validate()) return

    try {
      setLoading(true)

      const payload = { plate, model, capacity, status }

      if (isEdit) {
        await updateBus(busId!, payload as BusUpdateRQ)
      } else {
        await createBus(payload as BusCreateRQ)
      }

      onSuccess()
      onClose()
    } catch (error) {
      console.error("❌ Error al guardar bus:", error)
      toast.error("Ocurrió un error al guardar el bus.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent key={formKey} className="max-w-lg w-full mx-4">
        <DialogHeader className="pb-4">
          <DialogTitle className="text-lg font-semibold">{isEdit ? "Editar Bus" : "Nuevo Bus"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 overflow-hidden">
          {/* Placa */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Placa</Label>
            <Input
              value={plate}
              onChange={(e) => {
                setPlate(e.target.value)
                setTouched((prev) => ({ ...prev, plate: true }))
              }}
              disabled={loading}
              placeholder="Ej: ABC-123"
              className={`h-10 min-w-0 ${errors.plate && touched.plate ? "border-red-500" : ""}`}
            />
            <FieldError show={!!errors.plate && touched.plate} message={errors.plate} />
          </div>

          {/* Modelo */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Modelo</Label>
            <Input
              value={model}
              onChange={(e) => {
                setModel(e.target.value)
                setTouched((prev) => ({ ...prev, model: true }))
              }}
              disabled={loading}
              placeholder="Ej: Mercedes Sprinter"
              className={`h-10 min-w-0 ${errors.model && touched.model ? "border-red-500" : ""}`}
            />
            <FieldError show={!!errors.model && touched.model} message={errors.model} />
          </div>

          {/* Capacidad */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Capacidad</Label>
            <Input
              type="number"
              value={capacity}
              min={1}
              onChange={(e) => {
                setCapacity(Number(e.target.value))
                setTouched((prev) => ({ ...prev, capacity: true }))
              }}
              disabled={loading}
              className={`h-10 min-w-0 ${errors.capacity && touched.capacity ? "border-red-500" : ""}`}
            />
            <FieldError show={!!errors.capacity && touched.capacity} message={errors.capacity} />
          </div>

          {/* Estado */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Estado</Label>
            <Select
              value={status}
              onValueChange={(value) => {
                setStatus(value as BusStatus)
                setTouched((prev) => ({ ...prev, status: true }))
              }}
              disabled={loading}
            >
              <SelectTrigger
                className={`h-10 min-w-0 ${errors.status && touched.status ? "border-red-500" : ""}`}
              >
                {status ? (
                  <div className="flex items-center gap-2">
                    {(() => {
                      const config = statusConfig[status]
                      const Icon = config.icon
                      return (
                        <>
                          <Icon className={`h-4 w-4 ${config.color}`} />
                          <span className="truncate">{config.label}</span>
                        </>
                      )
                    })()}
                  </div>
                ) : (
                  <span className="text-muted-foreground">Selecciona un estado</span>
                )}
              </SelectTrigger>
              <SelectContent className="max-w-[calc(100vw-2rem)] sm:max-w-lg">
                {Object.entries(statusConfig).map(([key, config]) => (
                  <SelectItem key={key} value={key}>
                    <div className="flex items-center gap-2">
                      <config.icon className={`h-4 w-4 ${config.color}`} />
                      <span className="truncate">{config.label}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FieldError show={!!errors.status && touched.status} message={errors.status} />
          </div>

          {/* Botones */}
          <DialogFooter className="pt-4 gap-2 sm:gap-0">
            <Button type="button" variant="ghost" onClick={onClose} disabled={loading}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading || Object.values(errors).some(Boolean)}>
              {loading ? "Guardando..." : isEdit ? "Actualizar" : "Crear"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
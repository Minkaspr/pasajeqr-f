"use client"

import { useCallback, useEffect, useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { FieldError } from "@/components/field-error"
import { toast } from "sonner"

import { getPassengerById, updatePassenger } from "../lib/api"
import { usePassengerRefresh } from "./PassengerRefreshContext"
import { PassengerUpdateRQ, passengerUpdateSchema } from "../types/passenger.schema"


interface PassengerEditProps {
  passengerId: number
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit?: () => void
}

export function PassengerEdit({
  passengerId,
  open,
  onOpenChange,
  onSubmit,
}: PassengerEditProps) {
  const [formData, setFormData] = useState<PassengerUpdateRQ | null>(null)
  const [errors, setErrors] = useState<Partial<Record<keyof PassengerUpdateRQ, string>>>({})
  const [touched, setTouched] = useState<Partial<Record<keyof PassengerUpdateRQ, boolean>>>({})
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const refresh = usePassengerRefresh()

  useEffect(() => {
    if (!open) return
    const fetchPassenger = async () => {
      setLoading(true)
      try {
        const res = await getPassengerById(passengerId)
        const data = res.data
        if (!data) throw new Error("No se encontraron datos")

        setFormData({
          firstName: data.firstName,
          lastName: data.lastName,
          dni: data.dni,
          email: data.email,
          userStatus: data.status,
        })
        setErrors({})
        setTouched({})
      } catch (err: unknown) {
        console.error(err)
        toast.error("No se pudo cargar los datos del pasajero")
        onOpenChange(false)
      } finally {
        setLoading(false)
      }
    }
    fetchPassenger()
  }, [passengerId, open, onOpenChange])

  const validate = useCallback(() => {
    if (!formData) return false
    const result = passengerUpdateSchema.safeParse(formData)
    const newErrors: typeof errors = {}

    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors
      for (const key in fieldErrors) {
        const msg = fieldErrors[key as keyof PassengerUpdateRQ]?.[0]
        if (msg) newErrors[key as keyof PassengerUpdateRQ] = msg
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }, [formData])

  useEffect(() => {
    validate()
  }, [validate])

  const handleBlur = (field: keyof PassengerUpdateRQ) => {
    setTouched((prev) => ({ ...prev, [field]: true }))
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => prev ? { ...prev, [name]: value } : prev)
  }
  const handleSwitchChange = (field: keyof PassengerUpdateRQ, value: boolean) => {
    setFormData((prev) => prev ? { ...prev, [field]: value } : prev)
  }

  const handleSubmit = async () => {
    if (!formData) return

    setTouched(
      Object.keys(formData).reduce((acc, key) => {
        acc[key as keyof PassengerUpdateRQ] = true
        return acc
      }, {} as Record<keyof PassengerUpdateRQ, boolean>)
    )

    if (!validate()) {
      toast.error("Corrige los errores antes de guardar")
      return
    }

    setSubmitting(true)

    try {
      await updatePassenger(passengerId, formData)
      toast.success("Pasajero actualizado")
      refresh()
      onOpenChange(false)
      onSubmit?.()
    } catch (err: unknown) {
      console.error("Error al actualizar admin:", err)
      toast.error("Error al actualizar administrador")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Pasajero</DialogTitle>
          <DialogDescription>
            {loading ? "Cargando datos..." : "Modifica los campos del pasajero."}
          </DialogDescription>
        </DialogHeader>

        {formData && (
          <form className="grid gap-4 py-4" onSubmit={(e) => { e.preventDefault(); handleSubmit() }}>
            {/* Nombres */}
            <div className="space-y-1">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="firstName">Nombres</Label>
                <div className="col-span-3">
                  <Input
                    id="firstName"
                    name="firstName"
                    type="text"
                    value={formData.firstName ?? ""}
                    onChange={handleChange}
                    onBlur={() => handleBlur("firstName")}
                    className={touched.firstName && errors.firstName ? "border-red-500" : ""}
                  />
                </div>
              </div>
              <div className="ml-[calc(25%+1rem)]">
                <FieldError show={!!touched.firstName && !!errors.firstName} message={errors.firstName} />
              </div>
            </div>

            {/* Apellidos */}
            <div className="space-y-1">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="lastName">Apellidos</Label>
                <div className="col-span-3">
                  <Input
                    id="lastName"
                    name="lastName"
                    type="text"
                    value={formData.lastName ?? ""}
                    onChange={handleChange}
                    onBlur={() => handleBlur("lastName")}
                    className={touched.lastName && errors.lastName ? "border-red-500" : ""}
                  />
                </div>
              </div>
              <div className="ml-[calc(25%+1rem)]">
                <FieldError show={!!touched.lastName && !!errors.lastName} message={errors.lastName} />
              </div>
            </div>

            {/* DNI */}
            <div className="space-y-1">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="dni">DNI</Label>
                <div className="col-span-3">
                  <Input
                    id="dni"
                    name="dni"
                    type="text"
                    value={formData.dni ?? ""}
                    onChange={handleChange}
                    onBlur={() => handleBlur("dni")}
                    className={touched.dni && errors.dni ? "border-red-500" : ""}
                  />
                </div>
              </div>
              <div className="ml-[calc(25%+1rem)]">
                <FieldError show={!!touched.dni && !!errors.dni} message={errors.dni} />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-1">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email">Correo</Label>
                <div className="col-span-3">
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email ?? ""}
                    onChange={handleChange}
                    onBlur={() => handleBlur("email")}
                    className={touched.email && errors.email ? "border-red-500" : ""}
                  />
                </div>
              </div>
              <div className="ml-[calc(25%+1rem)]">
                <FieldError show={!!touched.email && !!errors.email} message={errors.email} />
              </div>
            </div>

            {/* Estado (Switch) */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="userStatus">Estado</Label>
              <Switch
                id="userStatus"
                checked={!!formData.userStatus}
                onCheckedChange={(value) => handleSwitchChange("userStatus", value)}
                className="col-span-3"
              />
            </div>

            {/* Botones */}
            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" type="button" onClick={() => onOpenChange(false)} disabled={submitting}>
                Cancelar
              </Button>
              <Button type="submit" disabled={submitting || loading}>
                {submitting ? "Actualizando..." : "Actualizar"}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}

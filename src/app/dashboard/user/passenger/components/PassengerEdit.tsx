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

import { PassengerDetailDTO } from "./passenger"
import { PassengerUpdateSchema, passengerUpdateSchema } from "./passengerSchema"

interface PassengerEditProps {
  passenger: PassengerDetailDTO
  open: boolean
  onOpenChange: (open: boolean) => void
  loading?: boolean
  onChange?: (field: keyof PassengerDetailDTO, value: string | boolean) => void
  onSubmit?: () => void
}

export function PassengerEdit({
  passenger,
  open,
  onOpenChange,
  loading = false,
  onChange,
  onSubmit,
}: PassengerEditProps) {
  const [formData, setFormData] = useState(passenger)
  const [errors, setErrors] = useState<Partial<Record<keyof PassengerUpdateSchema, string>>>({})
  const [touched, setTouched] = useState<Partial<Record<keyof PassengerUpdateSchema, boolean>>>({})

  useEffect(() => {
    setFormData(passenger)
    setErrors({})
    setTouched({})
  }, [passenger])

  const validate = useCallback(() => {
    const result = passengerUpdateSchema.safeParse(formData)
    const newErrors: Partial<Record<keyof PassengerUpdateSchema, string>> = {}

    if (!result.success) {
      for (const key in result.error.flatten().fieldErrors) {
        const msg = result.error.flatten().fieldErrors[key as keyof PassengerUpdateSchema]?.[0]
        if (msg) newErrors[key as keyof PassengerUpdateSchema] = msg
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }, [formData])

  useEffect(() => {
    validate()
  }, [validate])

  const handleBlur = (field: keyof PassengerUpdateSchema) => {
    setTouched((prev) => ({ ...prev, [field]: true }))
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    const val = type === "checkbox" ? checked : value
    setFormData((prev) => ({ ...prev, [name]: val }))
    if (onChange) onChange(name as keyof PassengerDetailDTO, val)
  }

  const handleSwitchChange = (name: keyof PassengerDetailDTO, value: boolean) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (onChange) onChange(name, value)
  }

  const handleSubmit = async () => {
    const isValid = validate()
    if (!isValid) {
      toast.error("Corrige los errores antes de guardar")
      return
    }

    if (onSubmit) {
      onSubmit()
      return
    }

    try {
      await new Promise((res) => setTimeout(res, 1000))
      toast.success("Pasajero actualizado")
      onOpenChange(false)
    } catch (error) {
      console.error(error)
      toast.error("Error al actualizar pasajero")
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Pasajero</DialogTitle>
          <DialogDescription>Modifica los campos del pasajero.</DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {/* Nombre */}
          <div className="grid grid-cols-4 items-start gap-4">
            <Label htmlFor="firstName" className="text-right">Nombres</Label>
            <div className="col-span-3">
              <Input
                id="firstName"
                name="firstName"
                value={formData.firstName || ""}
                onChange={handleChange}
                onBlur={() => handleBlur("firstName")}
                className={touched.firstName && errors.firstName ? "border-red-500" : ""}
              />
              <FieldError show={!!touched.firstName && !!errors.firstName} message={errors.firstName} />
            </div>
          </div>

          {/* Apellido */}
          <div className="grid grid-cols-4 items-start gap-4">
            <Label htmlFor="lastName" className="text-right">Apellidos</Label>
            <div className="col-span-3">
              <Input
                id="lastName"
                name="lastName"
                value={formData.lastName || ""}
                onChange={handleChange}
                onBlur={() => handleBlur("lastName")}
                className={touched.lastName && errors.lastName ? "border-red-500" : ""}
              />
              <FieldError show={!!touched.lastName && !!errors.lastName} message={errors.lastName} />
            </div>
          </div>

          {/* DNI */}
          <div className="grid grid-cols-4 items-start gap-4">
            <Label htmlFor="dni" className="text-right">DNI</Label>
            <div className="col-span-3">
              <Input
                id="dni"
                name="dni"
                value={formData.dni || ""}
                onChange={handleChange}
                onBlur={() => handleBlur("dni")}
                className={touched.dni && errors.dni ? "border-red-500" : ""}
              />
              <FieldError show={!!touched.dni && !!errors.dni} message={errors.dni} />
            </div>
          </div>

          {/* Email */}
          <div className="grid grid-cols-4 items-start gap-4">
            <Label htmlFor="email" className="text-right">Correo</Label>
            <div className="col-span-3">
              <Input
                id="email"
                name="email"
                value={formData.email || ""}
                onChange={handleChange}
                onBlur={() => handleBlur("email")}
                className={touched.email && errors.email ? "border-red-500" : ""}
              />
              <FieldError show={!!touched.email && !!errors.email} message={errors.email} />
            </div>
          </div>

          {/* Estado */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="status" className="text-right">Estado</Label>
            <Switch
              id="status"
              checked={!!formData.status}
              onCheckedChange={(value) => handleSwitchChange("status", value)}
              className="col-span-3"
            />
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? "Guardando..." : "Guardar"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

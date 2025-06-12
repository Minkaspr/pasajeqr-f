"use client"

import { useCallback, useEffect, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { DriverDetailDTO } from "@/types/driver"
import { toast } from "sonner"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FieldError } from "@/components/field-error"
import { DriverUpdateSchema, driverUpdateSchema } from "../validations/driverSchema"

interface DriverEditProps {
  driver: DriverDetailDTO
  open: boolean
  onOpenChange: (open: boolean) => void
  loading?: boolean
  onChange?: (field: keyof DriverDetailDTO, value: string | boolean | number) => void
  onSubmit?: () => void
}

export function DriverEdit({
  driver,
  open,
  onOpenChange,
  loading = false,
  onChange,
  onSubmit,
}: DriverEditProps) {
  const [formData, setFormData] = useState(driver)
  const [errors, setErrors] = useState<Partial<Record<keyof DriverUpdateSchema, string>>>({})
  const [touched, setTouched] = useState<Partial<Record<keyof DriverUpdateSchema, boolean>>>({})

  useEffect(() => {
    setFormData(driver)
    setErrors({})
    setTouched({})
  }, [driver])

  const validate = useCallback(() => {
    const result = driverUpdateSchema.safeParse(formData)
    const newErrors: Partial<Record<keyof DriverUpdateSchema, string>> = {}

    if (!result.success) {
      for (const key in result.error.flatten().fieldErrors) {
        const msg = result.error.flatten().fieldErrors[key as keyof DriverUpdateSchema]?.[0]
        if (msg) newErrors[key as keyof DriverUpdateSchema] = msg
      }
      console.log("Errores detectados en validación:", newErrors)
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }, [formData])

  useEffect(() => {
    validate()
  }, [validate])

  const handleBlur = (field: keyof DriverUpdateSchema) => {
    setTouched((prev) => ({ ...prev, [field]: true }))
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    const val = type === "checkbox" ? checked : value
    setFormData((prev) => ({ ...prev, [name]: val }))
    if (onChange) onChange(name as keyof DriverDetailDTO, val)
  }

  const handleSwitchChange = (name: keyof DriverDetailDTO, value: boolean) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (onChange) onChange(name, value)
  }

  const handleSelectChange = (name: keyof DriverDetailDTO, value: string) => {
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
      toast.success("Conductor actualizado")
      onOpenChange(false)
    } catch (error) {
      console.error(error)
      toast.error("Error al actualizar el conductor")
    }
  }

  return (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Editar Conductor</DialogTitle>
        <DialogDescription>Modifica los campos del conductor.</DialogDescription>
      </DialogHeader>

      <div className="grid gap-4 py-4">
        {/* Nombre */}
        <div className="grid grid-cols-4 items-start gap-4">
          <Label htmlFor="firstName" className="text-right">Nombre</Label>
          <div className="col-span-3">
            <Input
              id="firstName"
              name="firstName"
              value={formData.firstName || ""}
              onChange={handleInputChange}
              onBlur={() => handleBlur("firstName")}
              className={touched.firstName && errors.firstName ? "border-red-500" : ""}
            />
            <FieldError
              show={!!touched.firstName && !!errors.firstName}
              message={errors.firstName}
            />
          </div>
        </div>

        {/* Apellido */}
        <div className="grid grid-cols-4 items-start gap-4">
          <Label htmlFor="lastName" className="text-right">Apellido</Label>
          <div className="col-span-3">
            <Input
              id="lastName"
              name="lastName"
              value={formData.lastName || ""}
              onChange={handleInputChange}
              onBlur={() => handleBlur("lastName")}
              className={touched.lastName && errors.lastName ? "border-red-500" : ""}
            />
            <FieldError
              show={!!touched.lastName && !!errors.lastName}
              message={errors.lastName}
            />
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
              onChange={handleInputChange}
              onBlur={() => handleBlur("dni")}
              className={touched.dni && errors.dni ? "border-red-500" : ""}
            />
            <FieldError
              show={!!touched.dni && !!errors.dni}
              message={errors.dni}
            />
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
              onChange={handleInputChange}
              onBlur={() => handleBlur("email")}
              className={touched.email && errors.email ? "border-red-500" : ""}
            />
            <FieldError
              show={!!touched.email && !!errors.email}
              message={errors.email}
            />
          </div>
        </div>

        {/* Licencia */}
        <div className="grid grid-cols-4 items-start gap-4">
          <Label htmlFor="licenseNumber" className="text-right">Licencia</Label>
          <div className="col-span-3">
            <Input
              id="licenseNumber"
              name="licenseNumber"
              value={formData.licenseNumber || ""}
              onChange={handleInputChange}
              onBlur={() => handleBlur("licenseNumber")}
              className={touched.licenseNumber && errors.licenseNumber ? "border-red-500" : ""}
            />
            <FieldError
              show={!!touched.licenseNumber && !!errors.licenseNumber}
              message={errors.licenseNumber}
            />
          </div>
        </div>

        {/* Usuario activo - Switch */}
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="userStatus" className="text-right">Usuario activo</Label>
          <Switch
            id="userStatus"
            checked={!!formData.status}
            onCheckedChange={(value) => handleSwitchChange("status", value)}
            className="col-span-3"
          />
          <FieldError
            show={!!touched.status && !!errors.status}
            message={errors.status}
          />
        </div>

        {/* Estado del conductor - Select */}
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="driverStatus" className="text-left">
            Estado del conductor
          </Label>
          <Select
            value={formData.driverStatus || ""}
            onValueChange={(value) => handleSelectChange("driverStatus", value)}
          >
            <SelectTrigger className="col-span-3">
              <SelectValue placeholder="Seleccionar estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="AVAILABLE">Disponible</SelectItem>
              <SelectItem value="ON_SERVICE">En servicio</SelectItem>
              <SelectItem value="OFF_DUTY">Libre</SelectItem>
              <SelectItem value="SICK_LEAVE">Ausente</SelectItem>
            </SelectContent>
          </Select>
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
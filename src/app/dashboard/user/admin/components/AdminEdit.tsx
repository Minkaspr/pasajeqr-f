"use client"

import { useCallback, useEffect, useState } from "react"
import { toast } from "sonner"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { FieldError } from "@/components/field-error"

import { AdminUpdateRQ, adminUpdateSchema } from "../types/admin.schema"
import { getAdminById, updateAdmin } from "../lib/api"
import { useAdminRefresh } from "./AdminRefreshContext"

interface AdminEditProps {
  adminId: number
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit?: () => void
}

export function AdminEdit({ adminId, open, onOpenChange, onSubmit }: AdminEditProps) {
  const [form, setForm] = useState<AdminUpdateRQ | null>(null)
  const [errors, setErrors] = useState<Partial<Record<keyof AdminUpdateRQ, string>>>({})
  const [touched, setTouched] = useState<Partial<Record<keyof AdminUpdateRQ, boolean>>>({})
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const refresh = useAdminRefresh()

  // Cargar datos del admin
  useEffect(() => {
    if (!open) return

    const fetchAdmin = async () => {
      setLoading(true)
      try {
        const res = await getAdminById(adminId)
        const data = res.data

        if (!data) throw new Error("No se encontraron datos")

        setForm({
          firstName: data.firstName,
          lastName: data.lastName,
          dni: data.dni,
          email: data.email,
          birthDate: data.birthDate,
          userStatus: data.status,
        })

        setErrors({})
        setTouched({})
      } catch (err: unknown) {
        console.error(err)
        toast.error("No se pudo cargar los datos del administrador")
        onOpenChange(false)
      } finally {
        setLoading(false)
      }
    }

    fetchAdmin()
  }, [adminId, open, onOpenChange])

  // Validación
  const validate = useCallback(() => {
    if (!form) return false

    const result = adminUpdateSchema.safeParse(form)
    const newErrors: typeof errors = {}

    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors
      for (const key in fieldErrors) {
        const message = fieldErrors[key as keyof AdminUpdateRQ]?.[0]
        if (message) newErrors[key as keyof AdminUpdateRQ] = message
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }, [form])

  useEffect(() => {
    validate()
  }, [validate])

  const handleBlur = (field: keyof AdminUpdateRQ) => {
    setTouched((prev) => ({ ...prev, [field]: true }))
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setForm((prev) => prev ? { ...prev, [name]: value } : prev)
  }

  const handleSwitchChange = (field: keyof AdminUpdateRQ, value: boolean) => {
    setForm((prev) => prev ? { ...prev, [field]: value } : prev)
  }

  const handleSubmit = async () => {
    if (!form) return

    setTouched(
      Object.keys(form).reduce((acc, key) => {
        acc[key as keyof AdminUpdateRQ] = true
        return acc
      }, {} as Record<keyof AdminUpdateRQ, boolean>)
    )

    if (!validate()) {
      toast.error("Corrige los errores antes de guardar")
      return
    }

    setSubmitting(true)
    try {
      await updateAdmin(adminId, form)
      toast.success("Administrador actualizado correctamente")
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
          <DialogTitle>Editar Administrador</DialogTitle>
          <DialogDescription>
            {loading ? "Cargando datos..." : "Modifica los campos del administrador."}
          </DialogDescription>
        </DialogHeader>
        {form && (
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
                    value={form?.firstName ?? ""}
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
                    value={form?.lastName ?? ""}
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
                    value={form?.dni ?? ""}
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

            {/* Correo */}
            <div className="space-y-1">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email">Correo</Label>
                <div className="col-span-3">
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={form?.email ?? ""}
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

            {/* Fecha de nacimiento */}
            <div className="space-y-1">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="birthDate">Fecha de nacimiento</Label>
                <div className="col-span-3">
                  <Input
                    id="birthDate"
                    name="birthDate"
                    type="date"
                    value={form?.birthDate ?? ""}
                    onChange={handleChange}
                    onBlur={() => handleBlur("birthDate")}
                    className={touched.birthDate && errors.birthDate ? "border-red-500" : ""}
                  />
                </div>
              </div>
              <div className="ml-[calc(25%+1rem)]">
                <FieldError show={!!touched.birthDate && !!errors.birthDate} message={errors.birthDate} />
              </div>
            </div>

            {/* Switch de estado */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="userStatus">Estado</Label>
              <Switch
                id="userStatus"
                checked={!!form?.userStatus}
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

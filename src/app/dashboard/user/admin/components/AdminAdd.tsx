"use client"

import { useCallback, useEffect, useState } from "react"
import { Eye, EyeOff, PlusIcon } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { FieldError } from "@/components/field-error"
import { cn } from "@/lib/utils"
import { PasswordTooltipIcon } from "@/components/password-tooltip-icon"

import { createAdmin } from "../lib/api"
import { useAdminRefresh } from "./AdminRefreshContext"
import { adminCreateSchema, AdminCreateRQ } from "../types/admin.schema"

export function AdminAdd() {
  const refresh = useAdminRefresh()
  const [open, setOpen] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const [form, setForm] = useState<AdminCreateRQ >({
    firstName: "",
    lastName: "",
    dni: "",
    email: "",
    password: "",
    birthDate: "",
  })

  const [touched, setTouched] = useState<Record<keyof AdminCreateRQ, boolean>>({
    firstName: false,
    lastName: false,
    dni: false,
    email: false,
    password: false,
    birthDate: false,
  })

  const [errors, setErrors] = useState<Partial<Record<keyof AdminCreateRQ, string>>>({})
  const [formValid, setFormValid] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleBlur = (field: keyof AdminCreateRQ) => {
    setTouched((prev) => ({ ...prev, [field]: true }))
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    if (!touched[name as keyof AdminCreateRQ]) {
      setTouched((prev) => ({ ...prev, [name]: true }))
    }
  }

  const validate = useCallback(() => {
    const result = adminCreateSchema.safeParse(form)
    const newErrors: typeof errors = {}

    if (!result.success) {
      for (const key in result.error.flatten().fieldErrors) {
        const message = result.error.flatten().fieldErrors[key as keyof AdminCreateRQ]?.[0]
        if (message) {
          newErrors[key as keyof AdminCreateRQ] = message
        }
      }
    }

    setErrors(newErrors)
    setFormValid(Object.keys(newErrors).length === 0)
  }, [form])

  useEffect(() => {
    validate()
  }, [validate])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    validate()
    if (!formValid) return

    try {
      setLoading(true)
      await createAdmin(form)
      toast.success("Administrador creado correctamente")
      setOpen(false)
      refresh()
    } catch (err: unknown) {
      let message = "Error desconocido"
      if (err instanceof Error) message = err.message
      console.error("Error al crear admin:", message)
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  const renderField = (
    id: keyof AdminCreateRQ,
    label: string,
    type: string = "text",
    placeholder?: string
  ) => (
    <div className="space-y-1">
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor={id} className="text-left">{label}</Label>
        <div className="col-span-3">
          <Input
            id={id}
            name={id}
            type={type}
            value={form[id]}
            onChange={handleChange}
            onBlur={() => handleBlur(id)}
            placeholder={placeholder}
            className={cn(
              touched[id] && errors[id] && "border-red-500 focus-visible:border-red-500 focus-visible:ring-red-500/40"
            )}
          />
        </div>
      </div>
      <div className="ml-[calc(25%+1rem)]"> {/* compensa el Label */}
        <FieldError show={!!touched[id] && !!errors[id]} message={errors[id]} />
      </div>
    </div>
  )

  const [formKey, setFormKey] = useState(0)
  useEffect(() => {
    if (!open) {
      setForm({
        firstName: "",
        lastName: "",
        dni: "",
        email: "",
        password: "",
        birthDate: "",
      })
      setErrors({})
      setTouched({
        firstName: false,
        lastName: false,
        dni: false,
        email: false,
        password: false,
        birthDate: false,
      })
      setFormValid(false)
      setShowPassword(false)
      setFormKey((prev) => prev + 1)
    }
  }, [open])

  return (
    <div className="flex items-center justify-end">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline">
            <PlusIcon className="mr-2 h-4 w-4" />
            Añadir Admin
          </Button>
        </DialogTrigger>

        <DialogContent>
          <DialogHeader>
            <DialogTitle>Añadir nuevo administrador</DialogTitle>
            <DialogDescription>
              Completa los campos para crear un nuevo administrador.
            </DialogDescription>
          </DialogHeader>

          <form className="grid gap-4 py-4" key={formKey} onSubmit={handleSubmit}>
            {renderField("firstName", "Nombres")}
            {renderField("lastName", "Apellidos")}
            {renderField("dni", "DNI")}
            {renderField("email", "Correo", "email")}
            {/* Password con toggle de visibilidad */}
            <div className="space-y-1">
              <div className="grid grid-cols-4 items-center gap-4">
                <div className="flex items-center gap-2">
                  <Label htmlFor="password" className="text-right">Contraseña</Label>
                  <PasswordTooltipIcon />
                </div>
                <div className="col-span-3 relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={form.password}
                    onChange={handleChange}
                    onBlur={() => handleBlur("password")}
                    className={cn(
                      touched.password && errors.password &&
                      "border-red-500 focus-visible:border-red-500 focus-visible:ring-red-500/40"
                    )}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2 inset-y-0 flex items-center text-muted-foreground hover:text-primary focus:outline-none"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <div className="ml-[calc(25%+1rem)]">
                <FieldError show={!!touched.password && !!errors.password} message={errors.password} />
              </div>
            </div>

            {renderField("birthDate", "Fecha de nacimiento", "date")}

            <div className="flex justify-end">
              <Button type="submit" disabled={!formValid || loading}>
                {loading ? "Guardando..." : "Guardar"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

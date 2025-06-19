"use client"

import { UserData } from "@/app/customer/ClientInterface"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useEffect } from "react"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

const formSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  password: z.string()
    .min(8, "Debe tener al menos 8 caracteres")
    .regex(/[A-Z]/, "Debe incluir una mayúscula")
    .regex(/[a-z]/, "Debe incluir una minúscula")
    .regex(/[0-9]/, "Debe incluir un número"),
})

type FormData = z.infer<typeof formSchema>

interface SettingsFormProps {
  user: UserData
  onSave: (data: FormData) => void
  isDarkMode: boolean
  setIsDarkMode: (value: boolean) => void
}

export function SettingsForm({ user, onSave, isDarkMode, setIsDarkMode }: SettingsFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: user.name,
      password: "",
    },
  })

  useEffect(() => {
    reset({ name: user.name, password: "" })
  }, [user, reset])

  const onSubmit = (data: FormData) => {
    onSave(data)
  }

  return (
    <Card className="w-full max-w-md bg-muted/40">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-primary">Configuración</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div>
            <Input {...register("name")} placeholder="Tu nombre" />
            {errors.name && (
              <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>
            )}
          </div>
          <div>
            <Input type="password" {...register("password")} placeholder="Nueva contraseña" />
            {errors.password && (
              <p className="text-sm text-red-500 mt-1">{errors.password.message}</p>
            )}
          </div>

          <Button type="submit">Guardar Cambios</Button>

          <div className="flex items-center justify-between pt-4 border-t">
            <Label htmlFor="dark-mode">Modo Oscuro</Label>
            <Switch
              id="dark-mode"
              checked={isDarkMode}
              onCheckedChange={setIsDarkMode}
            />
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

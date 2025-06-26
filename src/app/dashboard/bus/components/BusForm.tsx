"use client"

import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Bus } from "@/types/bus"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"

const busSchema = z.object({
  plate: z.string().min(5, "Debe tener al menos 5 caracteres"),
  model: z.string().min(2, "Modelo requerido"),
  capacity: z.coerce.number().min(1, "Debe ser mayor que cero"),
  status: z.enum(["OPERATIONAL", "IN_SERVICE", "UNDER_MAINTENANCE", "OUT_OF_SERVICE"]),
})

export type BusFormValues = z.infer<typeof busSchema>

type Props = {
  open: boolean
  onClose: () => void
  onSubmit: (data: BusFormValues) => void
  editingBus?: Bus | null
}

export function BusForm({ open, onClose, onSubmit, editingBus }: Props) {
  console.log("🔄 Render BusForm", { open, editingBus })

  const form = useForm<BusFormValues>({
    resolver: zodResolver(busSchema),
    defaultValues: {
      plate: "",
      model: "",
      capacity: 20,
      status: "OPERATIONAL",
    },
  })

  const isEditing = !!editingBus

  useEffect(() => {
    if (open) {
      const values = {
        plate: editingBus?.plate ?? "",
        model: editingBus?.model ?? "",
        capacity: editingBus?.capacity ?? 20,
        status: editingBus?.status ?? "OPERATIONAL",
      }
      form.reset(values)
    } else {
    }
  }, [editingBus?.capacity, editingBus?.model, editingBus?.plate, editingBus?.status, form, open]) 

  const handleInternalSubmit = (values: BusFormValues) => {
    console.log("✅ Form submitted:", values)
    onSubmit(values)
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Editar bus" : "Registrar nuevo bus"}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Modifica la información del bus seleccionado."
              : "Completa los siguientes campos para registrar un nuevo bus."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleInternalSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="plate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Placa</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Ej: ABC-123" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="model"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Modelo</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Ej: Mercedes Sprinter" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="capacity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Capacidad</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Estado</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona un estado" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="OPERATIONAL">Operativo</SelectItem>
                      <SelectItem value="IN_SERVICE">En servicio</SelectItem>
                      <SelectItem value="UNDER_MAINTENANCE">En mantenimiento</SelectItem>
                      <SelectItem value="OUT_OF_SERVICE">Fuera de servicio</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button type="submit">
                {isEditing ? "Guardar cambios" : "Registrar bus"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

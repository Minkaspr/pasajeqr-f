"use client"

import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ServiceEntity, ServiceStatus, statusConfig } from "./types"

const serviceFormSchema = z.object({
  serviceCode: z.string().min(1, "Código requerido"),
  busPlate: z.string().min(1, "Placa requerida"),
  driverName: z.string().min(1, "Nombre del conductor requerido"),
  originStop: z.string().min(1, "Paradero de origen requerido"),
  destinationStop: z.string().min(1, "Paradero de destino requerido"),
  departureDate: z.string().min(1, "Fecha de salida requerida"),
  departureTime: z.string().min(1, "Hora de salida requerida"),
  arrivalDate: z.string().optional(),
  arrivalTime: z.string().optional(),
  status: z.nativeEnum(ServiceStatus),
})

export type ServiceFormValues = z.infer<typeof serviceFormSchema>

type Props = {
  open: boolean
  onClose: () => void
  onSubmit: (data: ServiceFormValues) => void
  initialData?: ServiceEntity | null
}

export function ServiceFormDialog({ open, onClose, onSubmit, initialData }: Props) {
  const isEditing = !!initialData

  const form = useForm<ServiceFormValues>({
    resolver: zodResolver(serviceFormSchema),
    defaultValues: {
      serviceCode: "",
      busPlate: "",
      driverName: "",
      originStop: "",
      destinationStop: "",
      departureDate: "",
      departureTime: "",
      arrivalDate: "",
      arrivalTime: "",
      status: ServiceStatus.SCHEDULED,
    },
  })

  useEffect(() => {
    if (open && initialData) {
      const { departureTime, arrivalTime, ...rest } = initialData
      const values: ServiceFormValues = {
        ...rest,
        departureDate: departureTime.toISOString().split("T")[0],
        departureTime: departureTime.toTimeString().slice(0, 5),
        arrivalDate: arrivalTime ? arrivalTime.toISOString().split("T")[0] : "",
        arrivalTime: arrivalTime ? arrivalTime.toTimeString().slice(0, 5) : "",
        status: initialData.status,
      }
      form.reset(values)
    }
  }, [open, initialData, form])

  const handleInternalSubmit = (values: ServiceFormValues) => {
    onSubmit(values)
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Editar Servicio" : "Registrar Servicio"}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Modifica los datos del servicio seleccionado."
              : "Completa los campos para registrar un nuevo servicio de transporte."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleInternalSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            {/** Código */}
            <FormField
              control={form.control}
              name="serviceCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Código</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/** Estado */}
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Estado</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona un estado" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.entries(statusConfig).map(([key, config]) => (
                        <SelectItem key={key} value={key}>
                          {config.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/** Placa del bus */}
            <FormField
              control={form.control}
              name="busPlate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Placa del Bus</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/** Nombre del conductor */}
            <FormField
              control={form.control}
              name="driverName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Conductor</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/** Origen y Destino */}
            <FormField
              control={form.control}
              name="originStop"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Paradero Origen</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="destinationStop"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Paradero Destino</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/** Fechas y Horas */}
            <FormField
              control={form.control}
              name="departureDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fecha de salida</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="departureTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Hora de salida</FormLabel>
                  <FormControl>
                    <Input type="time" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="arrivalDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fecha de llegada (opcional)</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="arrivalTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Hora de llegada (opcional)</FormLabel>
                  <FormControl>
                    <Input type="time" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="col-span-2 flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button type="submit">
                {isEditing ? "Guardar cambios" : "Registrar servicio"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

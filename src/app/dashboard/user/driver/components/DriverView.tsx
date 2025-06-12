"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { DriverDetailDTO } from "@/types/driver"
import { format } from "date-fns"
import { es } from "date-fns/locale"

const driverStatusLabels: Record<string, string> = {
  AVAILABLE: "Disponible",
  ON_SERVICE: "En servicio",
  OFF_DUTY: "Fuera de turno",
  SICK_LEAVE: "Baja médica",
}

interface DriverViewProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  driver: DriverDetailDTO
}

export function DriverView({ open, onOpenChange, driver }: DriverViewProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Detalle del Conductor</DialogTitle>
          <DialogDescription>
            Información completa del conductor seleccionado.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex justify-between border-b border-gray-700 pb-2">
            <span className="font-medium">Nombre completo:</span>
            <span>{driver.firstName} {driver.lastName}</span>
          </div>

          <div className="flex justify-between border-b border-gray-700 pb-2">
            <span className="font-medium">DNI:</span>
            <span>{driver.dni}</span>
          </div>

          <div className="flex justify-between border-b border-gray-700 pb-2">
            <span className="font-medium">Email:</span>
            <span>{driver.email}</span>
          </div>

          <div className="flex justify-between border-b border-gray-700 pb-2">
            <span className="font-medium">Licencia:</span>
            <span>{driver.licenseNumber}</span>
          </div>

          <div className="flex justify-between border-b border-gray-700 pb-2">
            <span className="font-medium">Usuario activo:</span>
            <span>{driver.status ? "Sí" : "No"}</span>
          </div>

          <div className="flex justify-between border-b border-gray-700 pb-2">
            <span className="font-medium">Estado del conductor:</span>
            <span>{driverStatusLabels[driver.driverStatus]}</span>
          </div>

          <div className="flex justify-between border-b border-gray-700 pb-2">
            <span className="font-medium">Fecha de registro:</span>
            <span>{format(new Date(driver.createdAt), "dd/MM/yyyy", { locale: es })}</span>
          </div>

          <div className="flex justify-between">
            <span className="font-medium">Última actualización:</span>
            <span>{format(new Date(driver.updatedAt), "dd/MM/yyyy hh:mm a", { locale: es })}</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

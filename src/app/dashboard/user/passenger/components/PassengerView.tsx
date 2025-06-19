"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { format } from "date-fns"
import { es } from "date-fns/locale"

import { PassengerDetailDTO } from "./passenger"

interface PassengerViewProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  passenger: PassengerDetailDTO
}

export function PassengerView({ open, onOpenChange, passenger }: PassengerViewProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Detalle del Pasajero</DialogTitle>
          <DialogDescription>
            Información completa del pasajero seleccionado.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex justify-between border-b border-gray-700 pb-2">
            <span className="font-medium">Nombre completo:</span>
            <span>{passenger.firstName} {passenger.lastName}</span>
          </div>

          <div className="flex justify-between border-b border-gray-700 pb-2">
            <span className="font-medium">DNI:</span>
            <span>{passenger.dni}</span>
          </div>

          <div className="flex justify-between border-b border-gray-700 pb-2">
            <span className="font-medium">Correo:</span>
            <span>{passenger.email}</span>
          </div>

          <div className="flex justify-between border-b border-gray-700 pb-2">
            <span className="font-medium">Saldo actual:</span>
            <span>S/. {passenger.balance.toFixed(2)}</span>
          </div>

          <div className="flex justify-between border-b border-gray-700 pb-2">
            <span className="font-medium">Usuario activo:</span>
            <span>{passenger.status ? "Sí" : "No"}</span>
          </div>

          <div className="flex justify-between border-b border-gray-700 pb-2">
            <span className="font-medium">Registrado el:</span>
            <span>{format(new Date(passenger.createdAt), "dd/MM/yyyy", { locale: es })}</span>
          </div>

          <div className="flex justify-between">
            <span className="font-medium">Última actualización:</span>
            <span>{format(new Date(passenger.updatedAt), "dd/MM/yyyy hh:mm a", { locale: es })}</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

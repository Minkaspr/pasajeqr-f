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
import { useEffect, useState } from "react"
import { toast } from "sonner"

import { getPassengerById } from "../lib/api"
import { PassengerDetailRS } from "../types/passenger"

interface PassengerViewProps {
  passengerId: number
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function PassengerView({ passengerId, open, onOpenChange }: PassengerViewProps) {

  const [passenger, setPassenger] = useState<PassengerDetailRS | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!open) return

    const fetchAdmin = async () => {
      setLoading(true)
      try {
        const res = await getPassengerById(passengerId)
        if (!res.data) throw new Error("No se encontraron datos del administrador")
        setPassenger(res.data)
      } catch (err: unknown) {
        console.error("Error al cargar admin:", err)
        toast.error(err instanceof Error ? err.message : "Error al cargar datos")
        onOpenChange(false)
      } finally {
        setLoading(false)
      }
    }

    fetchAdmin()
  }, [passengerId, open, onOpenChange])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Detalle del Pasajero</DialogTitle>
          <DialogDescription>
            {loading ? "Cargando datos..." : "Información completa del pasajero seleccionado."}
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="py-8 text-center text-sm text-muted-foreground">
            Cargando datos...
          </div>
        ) : passenger ? (
          <div className="space-y-4">
            <div className="flex justify-between border-b pb-2">
              <span className="font-medium">Nombre completo:</span>
              <span>{passenger.firstName} {passenger.lastName}</span>
            </div>

            <div className="flex justify-between border-b pb-2">
              <span className="font-medium">DNI:</span>
              <span>{passenger.dni}</span>
            </div>

            <div className="flex justify-between border-b pb-2">
              <span className="font-medium">Correo:</span>
              <span>{passenger.email}</span>
            </div>

            <div className="flex justify-between border-b pb-2">
              <span className="font-medium">Saldo actual:</span>
              <span>S/ {passenger.balance.toFixed(2)}</span>
            </div>

            <div className="flex justify-between border-b pb-2">
              <span className="font-medium">Usuario activo:</span>
              <span>{passenger.status ? "Sí" : "No"}</span>
            </div>

            <div className="flex justify-between border-b pb-2">
              <span className="font-medium">Registrado el:</span>
              <span>{format(new Date(passenger.createdAt), "dd/MM/yyyy", { locale: es })}</span>
            </div>

            <div className="flex justify-between">
              <span className="font-medium">Última actualización:</span>
              <span>{format(new Date(passenger.updatedAt), "dd/MM/yyyy hh:mm a", { locale: es })}</span>
            </div>
          </div>
        ) : (
          <div className="py-8 text-center text-sm text-muted-foreground">
            No hay datos disponibles.
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

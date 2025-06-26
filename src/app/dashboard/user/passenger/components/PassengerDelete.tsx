"use client"

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog"

import { toast } from "sonner"
import { PassengerMockItem } from "./passenger"
import { deletePassenger } from "./mockPassengers"
import { usePassengerRefresh } from "./PassengerRefreshContext"

interface PassengerDeleteProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  passenger: PassengerMockItem
}

export function PassengerDelete({ open, onOpenChange, passenger }: PassengerDeleteProps) {
  const refresh = usePassengerRefresh()

  const handleDelete = async () => {
    try {
      deletePassenger(passenger.id)
      toast.success(`Pasajero ${passenger.firstName} eliminado correctamente`)
      refresh()
      onOpenChange(false)
    } catch (error) {
      console.error("Error al eliminar pasajero:", error)
      toast.error("Error al eliminar pasajero")
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
          <AlertDialogDescription>
            Esta acción eliminará al pasajero{" "}
            <strong>{passenger.firstName} {passenger.lastName}</strong> de forma permanente.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete}>
            Eliminar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

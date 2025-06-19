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
import { usePassengerRefresh } from "./PassengerRefreshContext"
import { togglePassengerStatus } from "./mockPassengers"

interface PassengerToggleStatusProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  passenger: PassengerMockItem
}

export function PassengerToggleStatus({
  open,
  onOpenChange,
  passenger,
}: PassengerToggleStatusProps) {
  const refresh = usePassengerRefresh()

  const handleConfirm = async () => {
    try {
      togglePassengerStatus(passenger.id)
      toast.success(passenger.status ? "Cuenta desactivada" : "Cuenta activada")
      refresh()
      onOpenChange(false)
    } catch (error) {
      console.error("Error al cambiar el estado del pasajero:", error)
      toast.error("Error al cambiar el estado")
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {passenger.status ? "Desactivar cuenta" : "Activar cuenta"}
          </AlertDialogTitle>
          <AlertDialogDescription>
            ¿Estás seguro que quieres {passenger.status ? "desactivar" : "activar"} la cuenta de{" "}
            <strong>{passenger.firstName} {passenger.lastName}</strong>?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={handleConfirm}>Confirmar</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

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
import { useState } from "react"

import { PassengerUserItemRS } from "../types/passenger"
import { usePassengerRefresh } from "./PassengerRefreshContext"
import { changePassengerStatus } from "../lib/api"

interface PassengerToggleStatusProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  passenger: PassengerUserItemRS
}

export function PassengerToggleStatus({
  open,
  onOpenChange,
  passenger,
}: PassengerToggleStatusProps) {
  const refresh = usePassengerRefresh()
  const [loading, setLoading] = useState(false)

  const handleConfirm = async () => {
    setLoading(true)
    try {
      const newStatus = !passenger.status
      await changePassengerStatus(passenger.id, { active: newStatus })
      toast.success(
        newStatus
          ? "Cuenta activada correctamente"
          : "Cuenta desactivada correctamente"
      )
      refresh()
      onOpenChange(false)
    } catch (error) {
      console.error("Error al cambiar el estado del pasajero:", error)
      toast.error("Error al cambiar el estado")
    } finally {
      setLoading(false)
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
          <AlertDialogCancel disabled={loading}>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={loading}
          >
            {loading ? "Procesando..." : "Confirmar"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

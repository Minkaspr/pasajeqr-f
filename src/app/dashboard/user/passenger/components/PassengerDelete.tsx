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

import { usePassengerRefresh } from "./PassengerRefreshContext"
import { PassengerUserItemRS } from "../types/passenger"
import { deletePassenger } from "../lib/api"

interface PassengerDeleteProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  passenger: PassengerUserItemRS
}

export function PassengerDelete({ open, onOpenChange, passenger }: PassengerDeleteProps) {
  const refresh = usePassengerRefresh()
  const [loading, setLoading] = useState(false)

  const handleDelete = async () => {
    setLoading(true)  
    try {
      await deletePassenger(passenger.id)
      toast.success(`Pasajero ${passenger.firstName} eliminado correctamente`)
      refresh()
      onOpenChange(false)
    } catch (error) {
      console.error("Error al eliminar pasajero:", error)
      toast.error("Error al eliminar pasajero")
    }  finally {
      setLoading(false)
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
          <AlertDialogCancel disabled={loading}>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} disabled={loading}>
            {loading ? "Eliminando..." : "Eliminar"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

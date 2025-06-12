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
import { DriverListItem } from "@/types/driver"
import { useDriverRefresh } from "../client/DriverRefreshContext"
import { deleteDriver } from "../lib/api"
import { toast } from "sonner";

interface DriverDeleteProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  driver: DriverListItem
}

export function DriverDelete({ open, onOpenChange, driver }: DriverDeleteProps) {
  const refresh = useDriverRefresh()

  const handleDelete = async () => {
    try {
      await deleteDriver(driver.id)
      toast.success(`Conductor ${driver.firstName} eliminado correctamente`)
      refresh();
      onOpenChange(false);
    } catch (error) {
      console.error("Error al eliminar conductor:", error)
      toast.error("Error al eliminar conductor")
    }
  }
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
          <AlertDialogDescription>
            Esta acción eliminará al conductor <strong>{driver.firstName}</strong> de forma permanente.
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

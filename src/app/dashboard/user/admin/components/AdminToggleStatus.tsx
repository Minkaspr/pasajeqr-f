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
import { AdminListItem } from "./admin"
import { useAdminRefresh } from "./AdminRefreshContext"
import { toggleAdminStatus } from "./mockAdmins"

interface AdminToggleStatusProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  admin: AdminListItem
}

export function AdminToggleStatus({ open, onOpenChange, admin }: AdminToggleStatusProps) {
  const refresh = useAdminRefresh()

  const handleConfirm = async () => {
    try {
      toggleAdminStatus(admin.id)
      toast.success(admin.status ? "Cuenta desactivada" : "Cuenta activada")
      refresh()
      onOpenChange(false)
    } catch (error) {
      console.error("Error al cambiar el estado del admin:", error)
      toast.error("Error al cambiar el estado")
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {admin.status ? "Desactivar cuenta" : "Activar cuenta"}
          </AlertDialogTitle>
          <AlertDialogDescription>
            ¿Estás seguro que quieres {admin.status ? "desactivar" : "activar"} la cuenta de{" "}
            <strong>{admin.firstName} {admin.lastName}</strong>?
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

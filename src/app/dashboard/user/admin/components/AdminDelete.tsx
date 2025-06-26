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
import { deleteAdmin } from "./mockAdmins"
import { useAdminRefresh } from "./AdminRefreshContext"

interface AdminDeleteProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  admin: AdminListItem
}

export function AdminDelete({ open, onOpenChange, admin }: AdminDeleteProps) {
  const refresh = useAdminRefresh()

  const handleDelete = async () => {
    try {
      deleteAdmin(admin.id)
      toast.success(`Administrador ${admin.firstName} eliminado correctamente`)
      refresh()
      onOpenChange(false)
    } catch (error) {
      console.error("Error al eliminar administrador:", error)
      toast.error("Error al eliminar administrador")
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
          <AlertDialogDescription>
            Esta acción eliminará al administrador <strong>{admin.firstName} {admin.lastName}</strong> de forma permanente.
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

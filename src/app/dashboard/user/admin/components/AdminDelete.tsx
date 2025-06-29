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

import { useAdminRefresh } from "./AdminRefreshContext"
import { AdminUserItemRS } from "../types/admin"
import { deleteAdmin } from "../lib/api"  

interface AdminDeleteProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  admin: AdminUserItemRS
}

export function AdminDelete({ open, onOpenChange, admin }: AdminDeleteProps) {
  const refresh = useAdminRefresh()
  const [loading, setLoading] = useState(false)

  const handleDelete = async () => {
    setLoading(true)
    try {
      await deleteAdmin(admin.id)     
      toast.success(
        `Administrador ${admin.firstName} eliminado correctamente`
      )
      refresh()
      onOpenChange(false)
    } catch (err: unknown) {
      console.error("Error al eliminar administrador:", err)
      toast.error(
        err instanceof Error ? err.message : "Error al eliminar administrador"
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
          <AlertDialogDescription>
            Esta acción eliminará al administrador{" "}
            <strong>
              {admin.firstName} {admin.lastName}
            </strong>{" "}
            de forma permanente.
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

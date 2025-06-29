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

import { AdminUserItemRS } from "../types/admin"
import { useAdminRefresh } from "./AdminRefreshContext"
import { changeAdminStatus } from "../lib/api"

interface AdminToggleStatusProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  admin: AdminUserItemRS
}

export function AdminToggleStatus({ open, onOpenChange, admin }: AdminToggleStatusProps) {
  const refresh = useAdminRefresh()
  const [loading, setLoading] = useState(false)

  const handleConfirm = async () => {
    setLoading(true)
    try {
      // Invertimos el estado actual
      const newStatus = !admin.status
      await changeAdminStatus(admin.id, { active: newStatus })

      toast.success(
        newStatus
          ? "Cuenta activada correctamente"
          : "Cuenta desactivada correctamente"
      )
      refresh()
      onOpenChange(false)
    } catch (err: unknown) {
      console.error("Error al cambiar el estado del admin:", err)
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
            {admin.status ? "Desactivar cuenta" : "Activar cuenta"}
          </AlertDialogTitle>
          <AlertDialogDescription>
            ¿Estás seguro que quieres {admin.status ? "desactivar" : "activar"} la cuenta de{" "}
            <strong>{admin.firstName} {admin.lastName}</strong>?
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

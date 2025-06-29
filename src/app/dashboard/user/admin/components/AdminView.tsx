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

import { getAdminById } from "../lib/api"
import { AdminDetailRS  } from "../types/admin"
import { useState, useEffect } from "react"
import { toast } from "sonner"

interface AdminViewProps {
  adminId: number
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AdminView({ adminId, open, onOpenChange }: AdminViewProps) {

  const [admin, setAdmin] = useState<AdminDetailRS | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!open) return

    const fetchAdmin = async () => {
      setLoading(true)
      try {
        const res = await getAdminById(adminId)
        if (!res.data) throw new Error("No se encontraron datos del administrador")
        setAdmin(res.data)
      } catch (err: unknown) {
        console.error("Error al cargar admin:", err)
        toast.error(err instanceof Error ? err.message : "Error al cargar datos")
        onOpenChange(false)
      } finally {
        setLoading(false)
      }
    }

    fetchAdmin()
  }, [adminId, open, onOpenChange])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Detalle del Administrador</DialogTitle>
          <DialogDescription>
            {loading ? "Cargando datos..." : "Información completa del administrador seleccionado."}
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="py-8 text-center text-sm text-muted-foreground">
            Cargando datos...
          </div>
        ) : admin ? (
          <div className="space-y-4">
            <div className="flex justify-between border-b pb-2">
              <span className="font-medium">Nombre completo:</span>
              <span>{admin.firstName} {admin.lastName}</span>
            </div>

            <div className="flex justify-between border-b pb-2">
              <span className="font-medium">DNI:</span>
              <span>{admin.dni}</span>
            </div>

            <div className="flex justify-between border-b pb-2">
              <span className="font-medium">Correo:</span>
              <span>{admin.email}</span>
            </div>

            <div className="flex justify-between border-b pb-2">
              <span className="font-medium">Fecha de nacimiento:</span>
              <span>{format(new Date(admin.birthDate), "dd/MM/yyyy", { locale: es })}</span>
            </div>

            <div className="flex justify-between border-b pb-2">
              <span className="font-medium">Usuario activo:</span>
              <span>{admin.status ? "Sí" : "No"}</span>
            </div>

            <div className="flex justify-between border-b pb-2">
              <span className="font-medium">Registrado el:</span>
              <span>{format(new Date(admin.createdAt), "dd/MM/yyyy", { locale: es })}</span>
            </div>

            <div className="flex justify-between">
              <span className="font-medium">Última actualización:</span>
              <span>{format(new Date(admin.updatedAt), "dd/MM/yyyy hh:mm a", { locale: es })}</span>
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

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

import { AdminDetailDTO } from "./admin"

interface AdminViewProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  admin: AdminDetailDTO
}

export function AdminView({ open, onOpenChange, admin }: AdminViewProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Detalle del Administrador</DialogTitle>
          <DialogDescription>
            Información completa del administrador seleccionado.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex justify-between border-b border-gray-700 pb-2">
            <span className="font-medium">Nombre completo:</span>
            <span>{admin.firstName} {admin.lastName}</span>
          </div>

          <div className="flex justify-between border-b border-gray-700 pb-2">
            <span className="font-medium">DNI:</span>
            <span>{admin.dni}</span>
          </div>

          <div className="flex justify-between border-b border-gray-700 pb-2">
            <span className="font-medium">Correo:</span>
            <span>{admin.email}</span>
          </div>

          <div className="flex justify-between border-b border-gray-700 pb-2">
            <span className="font-medium">Fecha de nacimiento:</span>
            <span>{format(new Date(admin.birthDate), "dd/MM/yyyy", { locale: es })}</span>
          </div>

          <div className="flex justify-between border-b border-gray-700 pb-2">
            <span className="font-medium">Usuario activo:</span>
            <span>{admin.status ? "Sí" : "No"}</span>
          </div>

          <div className="flex justify-between border-b border-gray-700 pb-2">
            <span className="font-medium">Registrado el:</span>
            <span>{format(new Date(admin.createdAt), "dd/MM/yyyy", { locale: es })}</span>
          </div>

          <div className="flex justify-between">
            <span className="font-medium">Última actualización:</span>
            <span>{format(new Date(admin.updatedAt), "dd/MM/yyyy hh:mm a", { locale: es })}</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

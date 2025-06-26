"use client"

import { ServiceEntity, statusConfig } from "./types"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Edit, Trash2 } from "lucide-react"
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog"

interface Props {
  services: ServiceEntity[]
  onEdit: (service: ServiceEntity) => void
  onDelete: (service: ServiceEntity) => void
  startIndex: number
}

export function ServiceTable({ services, onEdit, onDelete, startIndex }: Props) {
  if (services.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-semibold text-muted-foreground mb-2">No hay servicios para mostrar</h3>
        <p className="text-muted-foreground">Ajusta los filtros o añade un nuevo servicio</p>
      </div>
    )
  }

  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">#</TableHead>
            <TableHead>Código</TableHead>
            <TableHead>Bus</TableHead>
            <TableHead>Conductor</TableHead>
            <TableHead>Ruta</TableHead>
            <TableHead>Salida</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead className="text-right w-32">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {services.map((service, index) => {
            const StatusIcon = statusConfig[service.status].icon
            return (
              <TableRow key={service.id} className="hover:bg-muted/50">
                <TableCell className="text-muted-foreground font-mono text-sm">
                  {String(startIndex + index + 1).padStart(2, "0")}
                </TableCell>
                <TableCell className="font-mono font-bold">{service.serviceCode}</TableCell>
                <TableCell className="font-medium">{service.busPlate}</TableCell>
                <TableCell>{service.driverName}</TableCell>
                <TableCell className="max-w-48">
                  <div className="flex items-center gap-1 text-sm">
                    <span className="truncate">{service.originStop}</span>
                    <span className="text-muted-foreground">→</span>
                    <span className="truncate">{service.destinationStop}</span>
                  </div>
                </TableCell>
                <TableCell className="text-sm">
                  {new Intl.DateTimeFormat("es-PE", {
                    dateStyle: "short",
                    timeStyle: "short",
                  }).format(service.departureTime)}
                </TableCell>
                <TableCell>
                  <Badge className={statusConfig[service.status].color}>
                    <StatusIcon className="h-3 w-3 mr-1" />
                    {statusConfig[service.status].label}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    {/* Editar */}
                    <Button variant="ghost" size="sm" onClick={() => onEdit(service)} className="h-8 w-8 p-0">
                      <Edit className="h-4 w-4" />
                      <span className="sr-only">Editar</span>
                    </Button>

                    {/* Eliminar con confirmación */}
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Eliminar</span>
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Esta acción no se puede deshacer. El servicio <strong>{service.serviceCode}</strong> será eliminado permanentemente.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => onDelete(service)}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            Eliminar
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}

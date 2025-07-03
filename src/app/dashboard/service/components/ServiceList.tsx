"use client"

import { statusConfig } from "../types/status-config"
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
import { TripItemRS } from "../types/service"

interface ServiceListProps {
  services: TripItemRS[]
  onEdit: (service: TripItemRS) => void
  onDelete: (service: TripItemRS) => void
}

export function ServiceList({ services, onEdit, onDelete }: ServiceListProps) {
  return (
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Código</TableHead>
            <TableHead>Bus</TableHead>
            <TableHead>Conductor</TableHead>
            <TableHead>Ruta</TableHead>
            <TableHead>Salida</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead className="text-center">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {services.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center text-muted-foreground py-6">
                No hay servicios registrados.
              </TableCell>
            </TableRow>
          ) : (
            services.map((service) => {
              const StatusIcon = statusConfig[service.status].icon

              const salidaFormatted = new Date(
                `${service.departureDate}T${service.departureTime}`
              ).toLocaleString("es-PE", {
                dateStyle: "short",
                timeStyle: "short",
              })

              return (
                <TableRow
                  key={service.id}
                  className="hover:bg-muted/50 even:bg-muted/25 transition-colors"
                >
                  <TableCell>
                    <span className="inline-block rounded bg-muted px-2 py-0.5 font-mono text-xs text-muted-foreground">
                      {service.code}
                    </span>
                  </TableCell>

                  <TableCell className="font-medium">{service.busPlate}</TableCell>
                  <TableCell className="font-medium">{service.driverName}</TableCell>

                  <TableCell className="max-w-52">
                    <div className="flex items-center gap-1 text-sm">
                      <span className="truncate">{service.originStopName}</span>
                      <span className="text-muted-foreground">→</span>
                      <span className="truncate">{service.destinationStopName}</span>
                    </div>
                  </TableCell>

                  <TableCell className="text-sm">{salidaFormatted}</TableCell>

                  <TableCell>
                    <Badge className={statusConfig[service.status].color}>
                      <StatusIcon className="h-3 w-3 mr-1" />
                      {statusConfig[service.status].label}
                    </Badge>
                  </TableCell>

                  <TableCell className="text-center">
                    <div className="flex justify-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onEdit(service)}
                        className="hover:scale-105 transition-transform"
                      >
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Editar servicio {service.code}</span>
                      </Button>

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            size="sm"
                            variant="destructive"
                            className="hover:scale-105 transition-transform"
                          >
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Eliminar servicio {service.code}</span>
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Esta acción no se puede deshacer. El servicio{" "}
                              <strong>{service.code}</strong> será eliminado permanentemente.
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
            })
          )}
        </TableBody>
      </Table>
    </div>
  )
}
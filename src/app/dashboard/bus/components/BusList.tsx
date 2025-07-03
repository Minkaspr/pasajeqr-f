"use client"

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
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog"

import { Edit, Trash2, Users } from "lucide-react"
import { getCapacityColor, statusConfig} from "../utils"
import { BusItemRS } from "../types/bus"

interface BusListProps {
  buses: BusItemRS[]
  onEdit: (bus: BusItemRS) => void
  onDelete: (bus: BusItemRS) => void
  startIndex: number
}

export function BusList({
  buses,
  onEdit,
  onDelete,
  startIndex,
}: BusListProps) {
  const formatDate = (date: string) =>
    new Intl.DateTimeFormat("es-PE", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(date))
  return (
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">#</TableHead>
            <TableHead>Placa</TableHead>
            <TableHead>Modelo</TableHead>
            <TableHead className="text-center">Capacidad</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead>Fecha Registro</TableHead>
            <TableHead className="text-right w-32">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {buses.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center text-muted-foreground py-6">
                No hay buses registrados.
              </TableCell>
            </TableRow>
          ) : (
            buses.map((bus, index) => {
              const StatusIcon = statusConfig[bus.status].icon
              return (
                <TableRow key={bus.id} className="hover:bg-muted/50 even:bg-muted/25">
                  <TableCell className="text-muted-foreground font-mono text-sm">
                    {String(startIndex + index + 1).padStart(2, "0")}
                  </TableCell>
                  <TableCell className="font-mono font-bold">{bus.plate}</TableCell>
                  <TableCell className="font-medium">{bus.model}</TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-1">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span className={getCapacityColor(bus.capacity)}>{bus.capacity}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={statusConfig[bus.status].color}>
                      <StatusIcon className="h-3 w-3 mr-1" />
                      {statusConfig[bus.status].label}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {formatDate(bus.createdAt)}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEdit(bus)}
                        className="h-8 w-8 p-0"
                      >
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Editar {bus.plate}</span>
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Eliminar {bus.plate}</span>
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Esta acción no se puede deshacer. El bus {bus.plate} será eliminado permanentemente.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => onDelete(bus)}
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

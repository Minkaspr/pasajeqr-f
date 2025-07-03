"use client"

import { Edit, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogFooter, AlertDialogTitle, AlertDialogDescription, AlertDialogCancel, AlertDialogAction } from "@/components/ui/alert-dialog"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { StopItemRS } from "../types/stop"

interface StopListProps {
  stops: StopItemRS[]
  startIndex: number
  onEdit: (stop: StopItemRS) => void
  onDelete: (stop: StopItemRS) => void
}

export function StopList({ stops, startIndex, onEdit, onDelete }: StopListProps) {
  const formatDate = (isoDate: string) =>
    format(new Date(isoDate), "dd/MM/yyyy", { locale: es })

  return (
    <div className="mx-auto w-full max-w-3xl space-y-2">
      {stops.map((stop, index) => (
        <div
          key={stop.id}
          className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
        >
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary text-sm font-medium">
              {String(startIndex + index + 1).padStart(2, "0")}
            </div>
            <div>
              <h3 className="font-medium">{stop.name}</h3>
              <p className="text-sm text-muted-foreground">
                Creado el {formatDate(stop.createdAt)}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => onEdit(stop)} className="h-8 w-8 p-0">
              <Edit className="h-4 w-4" />
              <span className="sr-only">Editar {stop.name}</span>
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                  <span className="sr-only">Eliminar {stop.name}</span>
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Esta acción no se puede deshacer. El paradero &quot;{stop.name}&quot; será eliminado permanentemente.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction onClick={() => onDelete(stop)} className="bg-red-600 hover:bg-red-700">
                    Eliminar
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      ))}
    </div>
  )
}

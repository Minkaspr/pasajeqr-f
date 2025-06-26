"use client"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Pencil, Trash2 } from "lucide-react"

interface Fare {
  id: string
  originStopId: string
  destinationStopId: string
  price: number
  associationCode: string
}

interface Stop {
  id: string
  name: string
}

interface FareListProps {
  fares: Fare[]
  stops: Stop[]
  onEdit: (fare: Fare) => void
  onDelete: (id: string) => void
}

export function FareList({ fares, stops, onEdit, onDelete }: FareListProps) {
  const getStopName = (id: string) => stops.find((s) => s.id === id)?.name || "—"

  if (fares.length === 0) {
    return <p className="text-muted-foreground text-sm">No hay tarifas registradas.</p>
  }

  return (
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Código</TableHead>
            <TableHead>Origen</TableHead>
            <TableHead>Destino</TableHead>
            <TableHead>Precio</TableHead>
            <TableHead className="text-center">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {fares.map((fare) => (
            <TableRow key={fare.id} className="hover:bg-muted/50 even:bg-muted/25 transition-colors">
              {/* Código como etiqueta */}
              <TableCell>
                <span className="inline-block rounded bg-muted px-2 py-0.5 font-mono text-xs text-muted-foreground">
                  {fare.associationCode}
                </span>
              </TableCell>

              {/* Origen */}
              <TableCell className="font-medium">
                {getStopName(fare.originStopId)}
              </TableCell>

              {/* Destino */}
              <TableCell className="font-medium">
                {getStopName(fare.destinationStopId)}
              </TableCell>
              
              {/* Precio como badge */}
              <TableCell>
                <span className="inline-block rounded bg-primary/10 text-primary px-2 py-0.5 text-sm font-semibold">
                  S/ {fare.price.toFixed(2)}
                </span>
              </TableCell>

              {/* Acciones con hover animado */}
              <TableCell className="text-center">
                <div className="flex justify-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onEdit(fare)}
                    className="hover:scale-105 transition-transform"
                  >
                    <Pencil className="h-4 w-4" />
                    <span className="sr-only">Editar tarifa {fare.associationCode}</span>
                  </Button>

                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => onDelete(fare.id)}
                    className="hover:scale-105 transition-transform"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Eliminar tarifa {fare.associationCode}</span>
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

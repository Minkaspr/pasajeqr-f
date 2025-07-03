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
import { FareItemRS } from "../types/fare"

interface FareListProps {
  fares: FareItemRS[]
  onEdit: (fare: FareItemRS) => void
  onDelete: (fare: FareItemRS) => void
}

export function FareList({ fares, onEdit, onDelete }: FareListProps) {
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
          {fares.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center text-muted-foreground py-6">
                No hay tarifas registradas.
              </TableCell>
            </TableRow>
          ) : (
            fares.map((fare) => (
              <TableRow
                key={fare.id}
                className="hover:bg-muted/50 even:bg-muted/25 transition-colors"
              >
                <TableCell>
                  <span className="inline-block rounded bg-muted px-2 py-0.5 font-mono text-xs text-muted-foreground">
                    {fare.code}
                  </span>
                </TableCell>

                <TableCell className="font-medium">{fare.originStopName}</TableCell>
                <TableCell className="font-medium">{fare.destinationStopName}</TableCell>

                <TableCell>
                  <span className="inline-block rounded bg-primary/10 text-primary px-2 py-0.5 text-sm font-semibold">
                    S/ {fare.price.toFixed(2)}
                  </span>
                </TableCell>

                <TableCell className="text-center">
                  <div className="flex justify-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onEdit(fare)}
                      className="hover:scale-105 transition-transform"
                    >
                      <Pencil className="h-4 w-4" />
                      <span className="sr-only">Editar tarifa {fare.code}</span>
                    </Button>

                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => onDelete(fare)}
                      className="hover:scale-105 transition-transform"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Eliminar tarifa {fare.code}</span>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}

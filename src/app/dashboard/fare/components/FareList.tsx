"use client"

import { Button } from "@/components/ui/button"
import { Trash2, Pencil } from "lucide-react"

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
    <div className="border rounded-md overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-muted text-left">
          <tr>
            <th className="px-4 py-2 font-medium">Código</th>
            <th className="px-4 py-2 font-medium">Origen</th>
            <th className="px-4 py-2 font-medium">Destino</th>
            <th className="px-4 py-2 font-medium">Precio</th>
            <th className="px-4 py-2 font-medium text-center">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {fares.map((fare) => (
            <tr key={fare.id} className="border-t">
              <td className="px-4 py-2 text-xs text-muted-foreground">{fare.associationCode}</td>
              <td className="px-4 py-2">{getStopName(fare.originStopId)}</td>
              <td className="px-4 py-2">{getStopName(fare.destinationStopId)}</td>
              <td className="px-4 py-2 font-medium text-primary">S/ {fare.price.toFixed(2)}</td>
              <td className="px-4 py-2 text-center">
                <div className="flex justify-center gap-2">
                  <Button size="sm" variant="outline" onClick={() => onEdit(fare)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => onDelete(fare.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

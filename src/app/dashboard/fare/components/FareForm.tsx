"use client"

import { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowRight } from "lucide-react"

interface Stop {
  id: string
  name: string
}

interface FareFormProps {
  open: boolean
  onClose: () => void
  onSubmit: (data: {
    originStopId: string
    destinationStopId: string
    price: number
  }) => void
  stops: Stop[]
  editingTariff?: {
    id: string
    originStopId: string
    destinationStopId: string
    price: number
  }
}

export function FareForm({
  open,
  onClose,
  onSubmit,
  stops,
  editingTariff,
}: FareFormProps) {
  const [formData, setFormData] = useState({ originStopId: "", destinationStopId: "", price: "" })
  const [errors, setErrors] = useState({ originStopId: "", destinationStopId: "", price: "" })

  useEffect(() => {
    if (editingTariff) {
      setFormData({
        originStopId: editingTariff.originStopId,
        destinationStopId: editingTariff.destinationStopId,
        price: editingTariff.price.toString(),
      })
    } else {
      setFormData({ originStopId: "", destinationStopId: "", price: "" })
    }
    setErrors({ originStopId: "", destinationStopId: "", price: "" })
  }, [editingTariff, open])

  const getStopName = (id: string) => stops.find((s) => s.id === id)?.name || ""

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newErrors = {
      originStopId: formData.originStopId ? "" : "Campo requerido",
      destinationStopId: formData.destinationStopId ? "" : "Campo requerido",
      price: formData.price ? "" : "Campo requerido",
    }
    setErrors(newErrors)
    if (!Object.values(newErrors).some((v) => v)) {
      onSubmit({
        ...formData,
        price: parseFloat(formData.price),
      })

      onClose()
    }
  }

  const formatPrice = (value: number): string => {
    return `S/ ${value.toFixed(2)}`
  }


  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{editingTariff ? "Editar Tarifa" : "Nueva Tarifa"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 py-4">
            {/* Error de asociación duplicada */}
            {/*errors.association && (
              <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
                {errors.association}
              </div>
            )*/}
            {/* Paradero Origen */}
            <div className="grid gap-2">
              <Label>Paradero de Origen</Label>
              <Select
                value={formData.originStopId}
                onValueChange={(v) => setFormData((f) => ({ ...f, originStopId: v }))}
              >
                <SelectTrigger className={`w-full ${errors.originStopId ? "border-red-500" : ""}`}>
                  <SelectValue placeholder="Selecciona el origen" />
                </SelectTrigger>
                <SelectContent>
                  {stops
                    .filter((s) => s.id !== formData.destinationStopId)
                    .map((s) => (
                      <SelectItem key={s.id} value={s.id}>
                        {s.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
              {errors.originStopId && <p className="text-sm text-red-500">{errors.originStopId}</p>}
            </div>

            {/* Paradero Destino */}
            <div className="grid gap-2">
              <Label>Paradero de Destino</Label>
              <Select
                value={formData.destinationStopId}
                onValueChange={(v) => setFormData((f) => ({ ...f, destinationStopId: v }))}
              >
                <SelectTrigger className={`w-full ${errors.destinationStopId ? "border-red-500" : ""}`}>
                  <SelectValue placeholder="Selecciona el destino" />
                </SelectTrigger>
                <SelectContent>
                  {stops
                    .filter((s) => s.id !== formData.originStopId)
                    .map((s) => (
                      <SelectItem key={s.id} value={s.id}>
                        {s.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
              {errors.destinationStopId && <p className="text-sm text-red-500">{errors.destinationStopId}</p>}
            </div>

            {/* Precio */}
            <div className="grid gap-2">
              <Label>Precio</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground text-sm">S/</span>
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  placeholder="0.00"
                  className={`pl-10 ${errors.price ? "border-red-500" : ""}`}
                />
              </div>
              {errors.price && <p className="text-sm text-red-500">{errors.price}</p>}
            </div>

            {/* Preview de la ruta */}
            {formData.originStopId && formData.destinationStopId && (
              <div className="p-3 bg-muted rounded-md">
                <p className="text-sm text-muted-foreground mb-1">Vista previa:</p>
                <div className="flex items-center gap-2 text-sm font-medium">
                  <span>{getStopName(formData.originStopId)}</span>
                  <ArrowRight className="h-4 w-4 text-primary" />
                  <span>{getStopName(formData.destinationStopId)}</span>
                  {formData.price && (
                    <>
                      <span className="text-muted-foreground">•</span>
                      <span className="text-primary">{formatPrice(Number.parseFloat(formData.price) || 0)}</span>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit">{editingTariff ? "Actualizar" : "Crear"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

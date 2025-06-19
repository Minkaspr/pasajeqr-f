import { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Stop } from "../../../../types/stop"


interface StopDialogProps {
  stop: Partial<Stop> | null
  onClose: () => void
  onSave: (stop: Stop) => void
}

export function StopDialog({ stop, onClose, onSave }: StopDialogProps) {
  const [name, setName] = useState("")

  useEffect(() => {
    if (stop?.name) setName(stop.name)
  }, [stop])

  if (!stop) return null

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!stop) return
    onSave({
      id: stop.id ?? crypto.randomUUID(),
      name,
      createdAt: stop.createdAt ?? new Date(),
    })
  }

  return (
    <Dialog open={!!stop} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{stop.id ? "Editar paradero" : "Nuevo paradero"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            autoFocus
            placeholder="Nombre del paradero"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <div className="flex justify-end gap-2">
            <Button type="button" variant="ghost" onClick={onClose}>Cancelar</Button>
            <Button type="submit">Guardar</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

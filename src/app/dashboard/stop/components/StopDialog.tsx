import { useCallback, useEffect, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { createStop, getStopById, updateStop } from "../lib/api"
import { FieldError } from "@/components/field-error"
import { stopUpdateSchema, stopCreateSchema, StopUpdateRQ, StopCreateRQ } from "../types/stop.schemas"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

interface StopDialogProps {
  stopId: number | null
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export function StopDialog({ stopId, isOpen, onClose, onSuccess }: StopDialogProps) {
  const isEdit = stopId !== null

  const [name, setName] = useState("")
  const [terminal, setTerminal] = useState(false)
  const [touched, setTouched] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [formKey, setFormKey] = useState(0) 

  const validate = useCallback(() => {
    const schema = isEdit ? stopUpdateSchema : stopCreateSchema
    const result = schema.safeParse({ name, terminal})

    if (!result.success) {
      const msg = result.error.flatten().fieldErrors.name?.[0] || ""
      setError(msg)
      return false
    }

    setError("")
    return true
  }, [isEdit, name, terminal])

  useEffect(() => {
    if (!stopId) return
    setLoading(true)
    getStopById(stopId)
      .then((res) => {
        if (res.data) {
          setName(res.data.name)
          setTerminal(res.data.terminal)
        }
      })
      .catch((err) => {
        console.error("❌ Error al cargar paradero:", err)
      })
      .finally(() => setLoading(false))
  }, [stopId])

  useEffect(() => {
    if (!isOpen) {
      setTerminal(false);
      setName("")
      setTouched(false)
      setError("")
      setFormKey((prev) => prev + 1)
    }
  }, [isOpen])

  useEffect(() => {
    if (touched) validate()
  }, [name, touched, validate])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setTouched(true)
    const isValid = validate()
    if (!isValid) return

    try {
      setLoading(true)
      if (isEdit) {
        const payload: StopUpdateRQ = { name, terminal }
         console.log("📦 Payload para update:", JSON.stringify(payload, null, 2))
        await updateStop(stopId!, payload)
      } else {
        const payload: StopCreateRQ = { name, terminal }
         console.log("📦 Payload para create:", JSON.stringify(payload, null, 2))
        await createStop(payload)
      }

      onSuccess()
      onClose()
    } catch (err) {
      console.error("❌ Error al guardar paradero:", err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent key={formKey}>
        <DialogHeader>
          <DialogTitle>{isEdit ? "Editar paradero" : "Nuevo paradero"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            autoFocus
            placeholder="Nombre del paradero"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onBlur={() => setTouched(true)}
            disabled={loading}
            className={error ? "border-red-500 focus-visible:ring-red-500/40" : ""}
          />
          <FieldError show={!!error} message={error} />

          {/* Switch para terminal */}
          <div className="flex items-center space-x-2">
            <Switch
              id="terminal"
              checked={terminal}
              onCheckedChange={setTerminal}
              disabled={loading}
            />
            <Label htmlFor="terminal">¿Es un terminal?</Label>
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="ghost" onClick={onClose} disabled={loading}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading || !!error}>
              {loading ? "Guardando..." : "Guardar"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
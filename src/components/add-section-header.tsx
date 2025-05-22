import { PlusIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"

export function AddSectionHeader() {
  return (
    <div className="flex items-center justify-end">
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm">
            <PlusIcon className="mr-2 h-4 w-4" />
            Añadir pasajero
          </Button>
        </DialogTrigger>

        <DialogContent>
          <DialogHeader>
            <DialogTitle>Añadir nuevo pasajero</DialogTitle>
            <DialogDescription>
              Completa los campos para crear un nuevo pasajero.
            </DialogDescription>
          </DialogHeader>

          {/* Aquí va el formulario */}
          <form>
            {/* Campos del formulario */}
            <input type="text" placeholder="Nombre" className="mb-2" />
            <input type="email" placeholder="Correo" className="mb-2" />
            <Button type="submit">Guardar</Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

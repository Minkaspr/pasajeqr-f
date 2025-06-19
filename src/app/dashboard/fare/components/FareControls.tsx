import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Plus, Search } from "lucide-react"

interface FareControlsProps {
  onCreate: () => void
  searchInput: string
  setSearchInput: (value: string) => void
  onSearch: () => void
}

export function FareControls({
  onCreate,
  searchInput,
  setSearchInput,
  onSearch,
}: FareControlsProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
      {/* Input de búsqueda + botón buscar tarifas */}
      <div className="flex gap-2 w-full sm:max-w-md">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por código... (ej. 1-4)"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline" onClick={onSearch}>
          Buscar
        </Button>
      </div>

      {/* Botón de crear */}
      <Button onClick={onCreate}>
        <Plus className="mr-2 h-4 w-4" />
        Nueva Tarifa
      </Button>
    </div>
  )
}

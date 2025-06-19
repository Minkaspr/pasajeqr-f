"use client"

import { Plus, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface StopControlsProps {
  search: string
  setSearch: (value: string) => void
  onSearch: () => void
  onCreate: () => void
}

export function StopControls({
  search,
  setSearch,
  onSearch,
  onCreate,
}: StopControlsProps) {
  return (
    <div className="mx-auto w-full max-w-3xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      {/* Sección izquierda: búsqueda + cantidad */}
      <div className="flex gap-2 w-full md:max-w-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar paradero..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline" onClick={onSearch}>
          Buscar
        </Button>
      </div>

      {/* Sección derecha: botón crear */}
      <Button
        onClick={onCreate}
        variant="default"
        className="bg-neutral-800 hover:bg-neutral-900 text-white"
      >
        <Plus className="w-4 h-4 mr-2" />
        Nuevo paradero
      </Button>
    </div>
  )
}

"use client"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Plus, Search } from "lucide-react"
import { useState } from "react"

type Props = {
  onSearch: (value: string) => void
  onCreate: () => void
}

export function BusControls({
  onSearch,
  onCreate,
}: Props) {
  const [searchInput, setSearchInput] = useState("")

  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
      {/* Búsqueda */}
      <div className="flex gap-2 w-full md:max-w-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por placa o modelo..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline" onClick={() => onSearch(searchInput)}>
          Buscar
        </Button>
      </div>

      {/* Nuevo + Selector de cantidad */}
      <div className="flex items-center gap-2 justify-between">
        <Button className="ml-2" onClick={onCreate}>
          <Plus className="w-4 h-4 mr-1" />
          Nuevo Bus
        </Button>
      </div>
    </div>
  )
}

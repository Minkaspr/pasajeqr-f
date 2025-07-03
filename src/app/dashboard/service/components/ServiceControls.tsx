"use client"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Plus, Search } from "lucide-react"

interface ServiceControlsProps {
  search: string
  setSearch: (value: string) => void
  onSearch: () => void
  onCreate: () => void
}

export function ServiceControls({
  search,
  setSearch,
  onSearch,
  onCreate,
}: ServiceControlsProps) {
  return (
    <div className="flex items-center justify-between gap-2 w-full flex-col sm:flex-row">
      {/* Campo de búsqueda */}
      <div className="flex gap-2 w-full @md:max-w-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground hidden @lg:block" />
          <Input
            placeholder="Buscar por código... (ej. SRV-1234)"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && onSearch()}
            className="w-full pl-3 @lg:pl-10 pr-10"
          />
          {/* Botón para pantallas pequeñas */}
          <Button
            variant="ghost"
            size="icon"
            onClick={onSearch}
            className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 p-0 text-muted-foreground @lg:hidden"
          >
            <Search className="h-4 w-4" />
          </Button>
        </div>

        {/* Botón para pantallas grandes */}
        <Button
          variant="outline"
          onClick={onSearch}
          className="hidden @lg:inline-flex"
        >
          Buscar
        </Button>
      </div>

      {/* Botón de crear */}
      <Button onClick={onCreate} className="px-3 @lg:px-4 shrink-0">
        <Plus className="w-4 h-4" />
        <span className="hidden @lg:inline ml-1">Nuevo Servicio</span>
      </Button>
    </div>
  )
}
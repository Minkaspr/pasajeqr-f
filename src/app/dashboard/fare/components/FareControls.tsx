import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Plus, Search } from "lucide-react"
import { useState } from "react"

type Props = {
  onSearch: (value: string) => void
  onCreate: () => void
}

export function FareControls({ onSearch, onCreate }: Props) {

  const [searchInput, setSearchInput] = useState("")
  
  const handleSearch = () => {
    onSearch(searchInput)
  }

  return (
    <div className="flex items-center justify-between gap-2 w-full">
      {/* Este div se adaptará al ancho del contenedor que está en BusClientView */}
      <div className="flex gap-2 w-full @md:max-w-sm">
        <div className="relative flex-1">
          <Input
            placeholder="Buscar por código... (ej. 1-4)"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            className="w-full pl-3 @lg:pl-10 pr-10"
          />

          <Button
            variant="ghost"
            size="icon"
            onClick={handleSearch}
            className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 p-0 text-muted-foreground @lg:hidden"
          >
            <Search className="h-4 w-4" />
          </Button>

          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground hidden @lg:block" />
        </div>

        <Button
          variant="outline"
          onClick={handleSearch}
          className="hidden @lg:inline-flex"
        >
          Buscar
        </Button>
      </div>

      <Button onClick={onCreate} className="px-3 @lg:px-4 shrink-0">
        <Plus className="w-4 h-4" />
        <span className="hidden @lg:inline ml-1">Nueva Tarifa</span>
      </Button>
    </div>
  )
}

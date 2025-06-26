"use client"

import { Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

interface Props {
  dni: string
  onChange: (value: string) => void
  onSearch: () => void
  isSearching: boolean
  error?: string
}

export function UserSearchCard({ dni, onChange, onSearch, isSearching, error }: Props) {
  return (
    <Card className="w-full max-w-full sm:max-w-md md:max-w-lg mx-auto">
      <CardHeader className="w-full">
        <CardTitle className="text-lg flex items-center gap-2">
          <Search className="h-5 w-5" />
          Buscar Usuario
        </CardTitle>
        <CardDescription>Ingresa el DNI del usuario para realizar una recarga</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex gap-3">
          <div className="flex-1">
            <Label htmlFor="dni" className="sr-only">DNI</Label>
            <Input
              id="dni"
              placeholder="Ingrese el DNI del usuario"
              value={dni}
              onChange={(e) => onChange(e.target.value)}
              className={cn(error && "border-red-500")}
              maxLength={12}
            />
            {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
          </div>
          <Button onClick={onSearch} disabled={isSearching}>
            {isSearching ? "Buscando..." : "Buscar"}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

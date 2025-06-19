"use client"

import { Button } from "@/components/ui/button"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface PaginationControlsProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  itemsPerPage: number
  setItemsPerPage: (value: number) => void
}

export function PaginationControls({
  currentPage,
  totalPages,
  onPageChange,
  itemsPerPage,
  setItemsPerPage,
}: PaginationControlsProps) {
  const canGoBack = currentPage > 1
  const canGoForward = currentPage < totalPages
  return (
    <div className="mx-auto w-full max-w-3xl flex flex-col sm:flex-row sm:items-center justify-between border-t pt-4 gap-4 text-sm text-muted-foreground">
      <div className="flex gap-2 items-center justify-between sm:justify-start flex-1">
        <span>
          Página {currentPage} de {totalPages}
        </span>
        -
        <Select
          value={itemsPerPage.toString()}
          onValueChange={(value) => setItemsPerPage(Number(value))}
        >
          Mostrar: 
          <SelectTrigger className="w-[80px] h-8 text-muted-foreground text-sm font-normal">
            <SelectValue placeholder="Mostrar" />
          </SelectTrigger>
          <SelectContent>
            {[5, 10, 15, 20].map((qty) => (
              <SelectItem key={qty} value={qty.toString()}>
                {qty}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={!canGoBack}
          className="gap-1"
        >
          <ChevronLeft className="h-4 w-4" />
          Anterior
        </Button>
        {[...Array(totalPages)].map((_, i) => (
          <Button
            key={i + 1}
            onClick={() => onPageChange(i + 1)}
            variant={currentPage === i + 1 ? "default" : "outline"}
            size="sm"
            className="w-8 h-8 p-0"
          >
            {i + 1}
          </Button>
        ))}
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={!canGoForward}
          className="gap-1"
        >
          Siguiente
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

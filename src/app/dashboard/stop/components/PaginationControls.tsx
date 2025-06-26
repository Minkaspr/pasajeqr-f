"use client"

import { Button } from "@/components/ui/button"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { ChevronLeft, ChevronRight } from "lucide-react"

import { useMediaQuery } from "@/hooks/useMediaQuery"

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
  const isSmallScreen = useMediaQuery("(max-width: 640px)")
  const maxVisiblePages = isSmallScreen ? 3 : 5

  const getVisiblePages = (): number[] => {
    if (totalPages <= maxVisiblePages) {
      return Array.from({ length: totalPages }, (_, i) => i + 1)
    }

    let start = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2))
    let end = start + maxVisiblePages - 1

    if (end > totalPages) {
      end = totalPages
      start = Math.max(1, end - maxVisiblePages + 1)
    }

    return Array.from({ length: end - start + 1 }, (_, i) => start + i)
  }

  const canGoBack = currentPage > 1
  const canGoForward = currentPage < totalPages
  return (
    <div className="mx-auto w-full max-w-3xl flex flex-row sm:items-center justify-between border-t pt-4 gap-4 text-sm text-muted-foreground">
      <div className="flex gap-2 items-center justify-start flex-1">
        <span className="hidden sm:inline-flex">
          Página {currentPage} de {totalPages}
        </span>
        <span className="hidden sm:inline-flex">-</span>
        <Select
          value={itemsPerPage.toString()}
          onValueChange={(value) => setItemsPerPage(Number(value))}
        >
          <span className="hidden @sm:block">Mostrar:</span>
          <SelectTrigger className="w-[80px] hidden @sm:flex">
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

      <div className="flex items-center gap-2 flex-wrap">
        <Button
          variant="outline"
          size="icon"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={!canGoBack}
          className="w-8 h-8"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        {getVisiblePages().map((page) => (
          <Button
            key={page}
            onClick={() => onPageChange(page)}
            variant={currentPage === page ? "default" : "outline"}
            size="icon"
            className="w-8 h-8 p-0"
          >
            {page}
          </Button>
        ))}

        <Button
          variant="outline"
          size="icon"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={!canGoForward}
          className="w-8 h-8"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

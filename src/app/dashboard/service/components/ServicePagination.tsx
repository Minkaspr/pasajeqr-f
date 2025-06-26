"use client"

import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { useMediaQuery } from "@/hooks/useMediaQuery"

interface ServicePaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  itemsPerPage: number
  onItemsPerPageChange: (value: number) => void
  totalItems: number
}

export function ServicePagination({
  currentPage,
  totalPages,
  onPageChange,
  itemsPerPage,
  onItemsPerPageChange,
  totalItems,
}: ServicePaginationProps) {
  const from = (currentPage - 1) * itemsPerPage + 1
  const to = Math.min(currentPage * itemsPerPage, totalItems)

  const isVerySmallScreen = useMediaQuery("(max-width: 400px)")
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
      start = end - maxVisiblePages + 1
    }

    return Array.from({ length: end - start + 1 }, (_, i) => start + i)
  }

  return (

    <div className="flex flex-col @sm:flex-row @sm:items-center @sm:justify-between gap-4 mt-6">
      {/* Texto de rango visible solo desde @lg */}
      <div className="shrink-0 text-sm text-muted-foreground hidden @xl:block">
        Mostrando <strong>{from}</strong>–<strong>{to}</strong> de <strong>{totalItems}</strong> buses
      </div>

      {/* Selector y controles de paginación */}
      <div className="flex flex-wrap items-center justify-end @xs:justify-between gap-2 w-full">
        {/* Selector de cantidad */}
          {!isVerySmallScreen && (
          <Select
            value={itemsPerPage.toString()}
            onValueChange={(value) => onItemsPerPageChange(Number(value))}
          >
            <SelectTrigger className="w-[120px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[5, 10, 20, 50].map((n) => (
                <SelectItem key={n} value={n.toString()}>
                  Mostrar {n}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        {/* Controles de paginación */}
        <div className="flex items-center gap-2 flex-wrap">
          <Button
            variant="outline"
            size="icon"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <div className="flex items-center gap-1">
            {getVisiblePages().map((page) => (
              <Button
                key={page}
                variant={currentPage === page ? "default" : "outline"}
                size="icon"
                onClick={() => onPageChange(page)}
              >
                {page}
              </Button>
            ))}

          </div>

          <Button
            variant="outline"
            size="icon"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}

"use client"

import { useState, useEffect } from "react"
import { useCallback } from "react"

import { StopList } from "./StopList"
import { PaginationControls } from "./PaginationControls"
import { StopControls } from "./StopControls"
import { StopDialog } from "./StopDialog"
import { deleteStop, getStopsPaged } from "../lib/api"
import { StopItemRS } from "../types/stop"
import { toast } from "sonner"

export function ParaderosClientView() {
  const [stops, setStops] = useState<StopItemRS[]>([])
  const [search, setSearch] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [totalPages, setTotalPages] = useState(1)
  const [editingStopId, setEditingStopId] = useState<number | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  //const totalPages = Math.ceil(filteredStops.length / itemsPerPage)

  const loadStops = useCallback(async () => {
    try {
      const response = await getStopsPaged(currentPage - 1, itemsPerPage, searchQuery)
      const stopItems: StopItemRS[] = response.data?.stops ?? []

      setStops(stopItems)
      setTotalPages(response.data?.totalPages || 1)
    } catch (error) {
      console.error("❌ Error al cargar paraderos:", error)
    }
  }, [currentPage, itemsPerPage, searchQuery]) // <== Añade searchQuery

  useEffect(() => {
    loadStops()
  }, [loadStops])

  const paginatedStops = stops

  const handleDelete = async (stop: StopItemRS) => {
    try {
      await deleteStop(stop.id)
      setStops((prev) => prev.filter((s) => s.id !== stop.id))
      toast.success(`Paradero "${stop.name}" eliminado correctamente`)
    } catch (error: unknown) {
      console.error("❌ Error al eliminar paradero:", error)

      if (error instanceof Error) {
        toast.error(error.message)
      } else {
        toast.error("Error desconocido al eliminar paradero")
      }
    }
  }

  return (
    <div className="@container space-y-4">
      <StopControls
        search={search}
        setSearch={setSearch}
        onSearch={() => {
          setSearchQuery(search)
          setCurrentPage(1)
        }}
        onCreate={() => {
          setEditingStopId(null)      // modo creación
          setIsDialogOpen(true)       // abrir modal
        }}
      />

      <StopList
        stops={paginatedStops}
        startIndex={(currentPage - 1) * itemsPerPage}
        onEdit={(stop) => {
          setEditingStopId(stop.id)   // modo edición
          setIsDialogOpen(true)       // abrir modal
        }}
        onDelete={handleDelete}
      />

      <PaginationControls
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        itemsPerPage={itemsPerPage}
        setItemsPerPage={(qty) => {
          setItemsPerPage(qty)
          setCurrentPage(1) // Resetear cuando cambia la cantidad
        }}
      />

      <StopDialog
        stopId={editingStopId}
        isOpen={isDialogOpen}
        onClose={() => {
          setIsDialogOpen(false)
          setEditingStopId(null)
        }}
        onSuccess={() => {
          loadStops()
          setIsDialogOpen(false)
          setEditingStopId(null)
        }}
      />
    </div>
  )
}

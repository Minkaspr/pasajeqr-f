"use client"

import { useCallback, useEffect, useState } from "react"

import { FareList } from "./FareList"
import { FareControls } from "./FareControls"
import { FarePagination } from "./FarePagination"
import { toast } from "sonner"
import { getFaresPaged, deleteFare} from "../lib/api"
import { FareItemRS } from "../types/fare"
import { FareDialog } from "./FareDialog"

export function FareClientView() {
  const [fares, setFares] = useState<FareItemRS[]>([])
  const [search, setSearch] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(5)
  const [totalPages, setTotalPages] = useState(1)
  const [editingFareId, setEditingFareId] = useState<number | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const loadFares = useCallback(async () => {
    try {
      const res = await getFaresPaged(currentPage - 1, itemsPerPage, searchQuery)
      setFares(res.data?.fares ?? [])
      setTotalPages(res.data?.totalPages ?? 1)
    } catch (error) {
      console.error("❌ Error al cargar tarifas:", error)
      toast.error("Error al cargar tarifas")
    }
  }, [currentPage, itemsPerPage, searchQuery])

  useEffect(() => {
    loadFares()
  }, [loadFares])

  const handleCreate = () => {
    setEditingFareId(null)
    setIsDialogOpen(true)
  }

  const handleEdit = (fare: FareItemRS) => {
    setEditingFareId(fare.id)
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: number) => {
    try {
      await deleteFare(id)
      toast.success("Tarifa eliminada correctamente")
      loadFares()
    } catch (error) {
      console.error("❌ Error al eliminar tarifa:", error)
      toast.error("Error al eliminar tarifa")
    }
  }

  return (
    <div className="@container w-full max-w-5xl mx-auto px-4 py-6 space-y-4">
      <FareControls
        search={search}
        setSearch={setSearch}
        onSearch={() => {
          setSearchQuery(search)
          setCurrentPage(1)
        }}
        onCreate={handleCreate}
      />

      <FareList
        fares={fares}
        onEdit={handleEdit}
        onDelete={(fare) => handleDelete(fare.id)}
      />

      <FarePagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={fares.length}
        onPageChange={setCurrentPage}
        itemsPerPage={itemsPerPage}
        setItemsPerPage={(qty) => {
          setItemsPerPage(qty)
          setCurrentPage(1)
        }}
      />

      <FareDialog
        fareId={editingFareId}
        isOpen={isDialogOpen}
        onClose={() => {
          setIsDialogOpen(false)
          setEditingFareId(null)
        }}
        onSuccess={() => {
          loadFares()
          setIsDialogOpen(false)
          setEditingFareId(null)
        }}
      />
    </div>
  )
}

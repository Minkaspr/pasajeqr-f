"use client"

import { useCallback, useEffect, useState } from "react"
import { BusList } from "./BusList"
import { BusPagination } from "./BusPagination"
import { BusControls } from "./BusControls"
import { BusForm } from "./BusForm"
import { toast } from "sonner"
import { getBusesPaged, deleteBus } from "../lib/api"
import { BusItemRS } from "../types/bus"

export default function BusClientView() {
  const [buses, setBuses] = useState<BusItemRS[]>([])
  const [search, setSearch] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(5)
  const [totalPages, setTotalPages] = useState(1)
  const [totalItems, setTotalItems] = useState(0)
  const [editingBus, setEditingBus] = useState<BusItemRS | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)

  const loadBuses = useCallback(async () => {
    try {
      const res = await getBusesPaged(currentPage - 1, itemsPerPage, searchQuery)
      setBuses(res.data?.buses ?? [])
      setTotalPages(res.data?.totalPages ?? 1)
      setTotalItems(res.data?.totalItems ?? 0)
    } catch (error) {
      console.error("❌ Error al cargar buses:", error)
      toast.error("Error al cargar buses")
    }
  }, [currentPage, itemsPerPage, searchQuery])

  useEffect(() => {
    loadBuses()
  }, [loadBuses])

  const handleCreate = () => {
    setEditingBus(null)
    setIsFormOpen(true)
  }

  const handleEdit = (bus: BusItemRS) => {
    setEditingBus(bus)
    setIsFormOpen(true)
  }

  const handleDelete = async (id: number) => {
    try {
      await deleteBus(id)
      toast.success("Bus eliminado correctamente")
      loadBuses()
    } catch (error) {
      console.error("❌ Error al eliminar bus:", error)
      toast.error("Error al eliminar bus")
    }
  }

  return (
    <div className="@container w-full max-w-5xl mx-auto px-4 py-6 space-y-4">
      <BusControls
        search={search}
        setSearch={setSearch}
        onSearch={() => {
          setSearchQuery(search)
          setCurrentPage(1)
        }}
        onCreate={handleCreate}
      />

      <BusList
        buses={buses}
        onEdit={handleEdit}
        onDelete={(bus) => handleDelete(bus.id)}
        startIndex={(currentPage - 1) * itemsPerPage}
      />

      <BusPagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalItems}
        itemsPerPage={itemsPerPage}
        setItemsPerPage={(qty) => {
          setItemsPerPage(qty)
          setCurrentPage(1)
        }}
        onPageChange={setCurrentPage}
      />

      <BusForm
        busId={editingBus?.id ?? null}
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false)
          setEditingBus(null)
        }}
        onSuccess={() => {
          loadBuses()
          setIsFormOpen(false)
          setEditingBus(null)
        }}
      />
    </div>
  )
}
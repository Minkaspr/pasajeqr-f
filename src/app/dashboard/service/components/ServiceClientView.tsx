"use client"

import { useCallback, useEffect, useState } from "react"

import { ServiceList } from "./ServiceList"
import { ServiceDialog } from "./ServiceDialog"
import { ServicePagination } from "./ServicePagination"
import { ServiceControls } from "./ServiceControls"
import { toast } from "sonner"
import { getTripsPaged, deleteTrip } from "../lib/api"
import { TripItemRS } from "../types/service"

export default function ServiceClientView() {
   const [services, setServices] = useState<TripItemRS[]>([])
  const [search, setSearch] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(5)
  const [totalPages, setTotalPages] = useState(1)
  const [editingServiceId, setEditingServiceId] = useState<number | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const loadTrips = useCallback(async () => {
    try {
      const res = await getTripsPaged(currentPage - 1, itemsPerPage, searchQuery)
      setServices(res.data?.services ?? [])
      setTotalPages(res.data?.totalPages ?? 1)
    } catch (error) {
      console.error("❌ Error al cargar servicios:", error)
      toast.error("Error al cargar servicios")
    }
  }, [currentPage, itemsPerPage, searchQuery])

  useEffect(() => {
    loadTrips()
  }, [loadTrips])

  const handleCreate = () => {
    setEditingServiceId(null)
    setIsDialogOpen(true)
  }

  const handleEdit = (service: TripItemRS) => {
    setEditingServiceId(service.id)
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: number) => {
    try {
      await deleteTrip(id)
      toast.success("Servicio eliminado correctamente")
      loadTrips()
    } catch (error) {
      console.error("❌ Error al eliminar servicio:", error)
      toast.error("Error al eliminar servicio")
    }
  }

  return (
    <div className="@container w-full max-w-5xl mx-auto px-4 py-6 space-y-4">
      <ServiceControls
        search={search}
        setSearch={setSearch}
        onSearch={() => {
          setSearchQuery(search)
          setCurrentPage(1)
        }}
        onCreate={handleCreate}
      />

      <ServiceList
        services={services}
        onEdit={handleEdit}
        onDelete={(service) => handleDelete(service.id)}
      />

      <ServicePagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={services.length}
        onPageChange={setCurrentPage}
        itemsPerPage={itemsPerPage}
        setItemsPerPage={(qty) => {
          setItemsPerPage(qty)
          setCurrentPage(1)
        }}
      />

      <ServiceDialog
        serviceId={editingServiceId}
        isOpen={isDialogOpen}
        onClose={() => {
          setIsDialogOpen(false)
          setEditingServiceId(null)
        }}
        onSuccess={() => {
          loadTrips()
          setIsDialogOpen(false)
          setEditingServiceId(null)
        }}
      />
    </div>
  )
}

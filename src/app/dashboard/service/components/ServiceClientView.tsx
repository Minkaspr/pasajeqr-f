"use client"

import { useEffect, useMemo, useState } from "react"

import { ServiceEntity, ServiceStatus } from "./types"
import { generateMockServices } from "./mockData"
import { ServiceTable } from "./ServiceTable"
import { ServiceFormDialog, ServiceFormValues } from "./ServiceFormDialog"
import { ServicePagination } from "./ServicePagination"
import { ServiceControls } from "./ServiceControls"

export default function ServiceClientView() {
  const [services, setServices] = useState<ServiceEntity[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingService, setEditingService] = useState<ServiceEntity | null>(null)

  const [searchTerm, setSearchTerm] = useState("")

  // ✅ Generar mock data en cliente
  useEffect(() => {
    setServices(generateMockServices())
  }, [])

  // 🔍 Filtro solo por código
  const filteredServices = useMemo(() => {
    return services.filter((s) =>
      s.serviceCode.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [services, searchTerm])

  const totalPages = Math.ceil(filteredServices.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedServices = filteredServices.slice(startIndex, startIndex + itemsPerPage)

  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, itemsPerPage])

  const handleEdit = (service: ServiceEntity) => {
    setEditingService(service)
    setIsFormOpen(true)
  }

  const handleCreate = () => {
    setEditingService(null)
    setIsFormOpen(true)
  }

  const handleSubmit = (data: ServiceFormValues) => {
    const newService: ServiceEntity = {
      ...editingService,
      ...data,
      id: editingService?.id ?? String(Date.now()),
      createdAt: editingService?.createdAt ?? new Date(),
      departureTime: new Date(`${data.departureDate}T${data.departureTime}`),
      arrivalTime:
        data.arrivalDate && data.arrivalTime
          ? new Date(`${data.arrivalDate}T${data.arrivalTime}`)
          : null,
      status: editingService?.status ?? ServiceStatus.SCHEDULED, // o lo que desees por defecto
    }

    if (editingService) {
      setServices((prev) => prev.map((s) => (s.id === newService.id ? newService : s)))
    } else {
      setServices((prev) => [newService, ...prev])
    }

    setIsFormOpen(false)
    setEditingService(null)
  }

  const handleDelete = (service: ServiceEntity) => {
    setServices((prev) => prev.filter((s) => s.id !== service.id))
  }

  return (
    <div className="@container w-full max-w-5xl mx-auto px-4 py-6 space-y-4">
      {/* Controles */}
      <ServiceControls
        onSearch={(value) => {
          setSearchTerm(value)
          setCurrentPage(1)
        }}
        onCreate={handleCreate}
      />

      {/* Tabla */}
      <ServiceTable
        services={paginatedServices}
        onEdit={handleEdit}
        onDelete={handleDelete}
        startIndex={startIndex}
      />

      {/* Nueva paginación reutilizable */}
      <ServicePagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        itemsPerPage={itemsPerPage}
        onItemsPerPageChange={(value) => {
          setItemsPerPage(value)
          setCurrentPage(1)
        }}
        totalItems={filteredServices.length}
      />

      {/* Dialog */}
      <ServiceFormDialog
        open={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleSubmit}
        initialData={editingService}
      />
    </div>
  )
}

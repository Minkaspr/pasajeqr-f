"use client"

import { useEffect, useMemo, useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Plus, Search } from "lucide-react"

import { ServiceEntity, ServiceStatus } from "./types"
import { generateMockServices } from "./mockData"
import { ServiceTable } from "./ServiceTable"
import { ServiceFormDialog, ServiceFormValues } from "./ServiceFormDialog"
import { ServicePagination } from "./ServicePagination" // tu nuevo componente

export default function ServiceClientView() {
  const [services, setServices] = useState<ServiceEntity[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingService, setEditingService] = useState<ServiceEntity | null>(null)

  const [searchInput, setSearchInput] = useState("")
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
    <div className="space-y-6 max-w-6xl mx-auto py-6">
      {/* Controles */}
      <div className="flex items-center justify-between">
        <div className="flex gap-2 w-full sm:max-w-md">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por código (ej. SRV-1234)"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button variant="outline" onClick={() => setSearchTerm(searchInput)}>
            Buscar
          </Button>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="w-4 h-4 mr-1" />
          Nuevo Servicio
        </Button>
      </div>

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
        setItemsPerPage={setItemsPerPage}
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

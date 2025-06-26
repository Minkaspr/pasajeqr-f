"use client"

import { useMemo, useState } from "react"
import { Bus } from "@/types/bus"
import { BusList } from "./BusList"
import { BusPagination } from "./BusPagination"
import { BusControls } from "./BusControls"
import { BusForm } from "./BusForm"
import type { BusFormValues } from "./BusForm"

const initialMockBuses: Bus[] = Array.from({ length: 20 }, (_, i) => ({
  id: crypto.randomUUID(),
  plate: `BUS-${(100 + i).toString()}`,
  model: ["Mercedes Sprinter", "Hyundai County", "Volvo B8R", "Iveco Daily", "Scania F94"][i % 5],
  capacity: [20, 34, 45, 28, 40][i % 5],
  status: ["OPERATIONAL", "IN_SERVICE", "UNDER_MAINTENANCE", "OUT_OF_SERVICE"][i % 4] as Bus["status"],
  createdAt: new Date(Date.now() - i * 86400000),
}))

export default function BusClientView() {
  const [buses, setBuses] = useState<Bus[]>(initialMockBuses)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(5)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingBus, setEditingBus] = useState<Bus | null>(null)

  const [searchTerm, setSearchTerm] = useState("")

  const filteredBuses = useMemo(() => {
    const term = searchTerm.toLowerCase()
    return buses.filter(
      (bus) =>
        bus.plate.toLowerCase().includes(term) ||
        bus.model.toLowerCase().includes(term)
    )
  }, [searchTerm, buses])

  const totalPages = Math.ceil(filteredBuses.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedBuses = filteredBuses.slice(startIndex, startIndex + itemsPerPage)

  const handleCreate = () => {
    setEditingBus(null)
    setIsFormOpen(true)
  }

  const handleEdit = (bus: Bus) => {
    setEditingBus(bus)
    setIsFormOpen(true)
  }

  const handleSubmit = (data: BusFormValues) => {
    if (editingBus) {
      const updatedBus: Bus = {
        ...editingBus,
        ...data,
      }
      setBuses((prev) => prev.map((b) => (b.id === updatedBus.id ? updatedBus : b)))
    } else {
      const newBus: Bus = {
        id: crypto.randomUUID(),
        createdAt: new Date(),
        ...data,
      }
      setBuses((prev) => [newBus, ...prev])
    }

    setIsFormOpen(false)
    setEditingBus(null)
  }

  const handleDelete = (bus: Bus) => {
    setBuses((prev) => prev.filter((b) => b.id !== bus.id))
  }

  const formatDate = (date: Date) =>
    new Intl.DateTimeFormat("es-PE", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(date)

  return (
    <div className="@container w-full max-w-5xl mx-auto px-4 py-6 space-y-4">
      <BusControls
        onSearch={(value) => {
          setSearchTerm(value)
          setCurrentPage(1)
        }}
        onCreate={handleCreate}
      />

      <BusList
        paginatedBuses={paginatedBuses}
        startIndex={startIndex}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
        formatDate={formatDate}
      />

      <BusPagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        itemsPerPage={itemsPerPage}
        onItemsPerPageChange={(value) => {
          setItemsPerPage(value)
          setCurrentPage(1)
        }}
        totalItems={filteredBuses.length}
      />

      <BusForm
        open={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleSubmit}
        editingBus={editingBus}
      />
    </div>
  )
}

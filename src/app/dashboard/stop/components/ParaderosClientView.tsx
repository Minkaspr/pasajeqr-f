"use client"

import { useState, useMemo } from "react"
import { StopList, Stop } from "./StopList"
import { PaginationControls } from "./PaginationControls"
import { StopControls } from "./StopControls"
import { StopDialog } from "./StopDialog"

const fakeStops: Stop[] = [
  { id: "1", name: "Av. Universitaria - Puerta 1 UNMSM", createdAt: new Date() },
  { id: "2", name: "Av. Colonial - Paradero Lima Norte", createdAt: new Date() },
  { id: "3", name: "Av. Venezuela - Cruce con Faucett", createdAt: new Date() },
  { id: "4", name: "Plaza Bolognesi", createdAt: new Date() },
  { id: "5", name: "Paradero Grau - Hospital 2 de Mayo", createdAt: new Date() },
  { id: "6", name: "Av. Abancay - Universidad Villarreal", createdAt: new Date() },
  { id: "7", name: "Estación Central - Metropolitano", createdAt: new Date() },
  { id: "8", name: "Paradero Tingo María", createdAt: new Date() },
  { id: "9", name: "Óvalo Naranjal", createdAt: new Date() },
  { id: "10", name: "Cruce Javier Prado - Arequipa", createdAt: new Date() },
  { id: "11", name: "Óvalo Higuereta", createdAt: new Date() },
  { id: "12", name: "Paradero Santa Anita", createdAt: new Date() },
  { id: "13", name: "Puente Nuevo", createdAt: new Date() },
  { id: "14", name: "Estación Bayóvar", createdAt: new Date() },
  { id: "15", name: "Av. Brasil - Hospital del Niño", createdAt: new Date() },
]

export function ParaderosClientView() {
  const [stops, setStops] = useState<Stop[]>(fakeStops)
  const [search, setSearch] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [editingStop, setEditingStop] = useState<Stop | null>(null)

  const filteredStops = useMemo(() => {
    return stops.filter((stop) =>
      stop.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [searchQuery, stops])

  const paginatedStops = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage
    return filteredStops.slice(start, start + itemsPerPage)
  }, [filteredStops, currentPage, itemsPerPage])

  const totalPages = Math.ceil(filteredStops.length / itemsPerPage)

  function handleEdit(stop: Stop) {
    setEditingStop(stop)
  }

  function handleDelete(stop: Stop) {
    setStops((prev) => prev.filter((s) => s.id !== stop.id))
  }

  return (
    <div className="space-y-4">
      <StopControls
        search={search}
        setSearch={setSearch}
        onSearch={() => {
          setSearchQuery(search)
          setCurrentPage(1) // Resetear página cuando se hace una nueva búsqueda
        }}
        onCreate={() =>
          setEditingStop({ id: "", name: "", createdAt: new Date() })
        }
      />

      <StopList
        stops={paginatedStops}
        startIndex={(currentPage - 1) * itemsPerPage}
        onEdit={handleEdit}
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
        stop={editingStop}
        onClose={() => setEditingStop(null)}
        onSave={(newStop) => {
          if (newStop.id) {
            setStops((prev) =>
              prev.map((s) => (s.id === newStop.id ? newStop : s))
            )
          } else {
            setStops((prev) => [
              { ...newStop, id: crypto.randomUUID(), createdAt: new Date() },
              ...prev,
            ])
          }
          setEditingStop(null)
        }}
      />
    </div>
  )
}

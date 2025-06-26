"use client"

import { useEffect, useMemo, useState } from "react"
import { FareForm } from "./FareForm"
import { FareList } from "./FareList"
import { FareControls } from "./FareControls"
import { FarePagination } from "./FarePagination"

interface Stop {
  id: string
  name: string
}

interface Fare {
  id: string
  originStopId: string
  destinationStopId: string
  price: number
  associationCode: string
}

const MOCK_STOPS: Stop[] = [
  { id: "1", name: "Terminal Central" },
  { id: "2", name: "Plaza Mayor" },
  { id: "3", name: "Hospital Regional" },
  { id: "4", name: "Universidad Nacional" },
  { id: "5", name: "Centro Comercial Norte" },
  { id: "6", name: "Estadio Municipal" },
  { id: "7", name: "Aeropuerto Internacional" },
  { id: "8", name: "Mercado Central" },
  { id: "9", name: "Parque Industrial" },
  { id: "10", name: "Terminal de Buses" },
]

const generateAssociationCode = (originId: string, destinationId: string): string => {
  return `${originId}-${destinationId}`
}

const generateMockFares = (): Fare[] => {
  const fares: Fare[] = []

  for (let i = 0; i < 25; i++) {
    const originIndex = Math.floor(Math.random() * MOCK_STOPS.length)
    let destinationIndex = Math.floor(Math.random() * MOCK_STOPS.length)

    // Evitar origen = destino
    while (destinationIndex === originIndex) {
      destinationIndex = Math.floor(Math.random() * MOCK_STOPS.length)
    }

    fares.push({
      id: crypto.randomUUID(),
      originStopId: MOCK_STOPS[originIndex].id,
      destinationStopId: MOCK_STOPS[destinationIndex].id,
      price: parseFloat((Math.random() * 5 + 1).toFixed(2)), // Entre 1 y 6 soles
      associationCode: generateAssociationCode(MOCK_STOPS[originIndex].id, MOCK_STOPS[destinationIndex].id),
    })
  }

  return fares
}

export function FareClientView() {
  const [fares, setFares] = useState<Fare[]>([])
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingFare, setEditingFare] = useState<Fare | undefined>(undefined)

  // Paginación
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(5)

  // Busqueda
  const [searchTerm, setSearchTerm] = useState("")


  const filteredFares = useMemo(() => {
    const query = searchTerm.toLowerCase().trim()
    return fares.filter((fare) =>
      fare.associationCode.toLowerCase().includes(query)
    )
  }, [searchTerm, fares])

  const totalPages = Math.ceil(filteredFares.length / itemsPerPage)
  const paginatedFares = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage
    return filteredFares.slice(start, start + itemsPerPage)
  }, [filteredFares, currentPage, itemsPerPage])

  const handleCreate = () => {
    setEditingFare(undefined)
    setIsFormOpen(true)
  }

  const handleSubmit = (data: { originStopId: string; destinationStopId: string; price: number }) => {
    if (editingFare) {
      setFares((prev) =>
        prev.map((f) =>
          f.id === editingFare.id
            ? {
                ...editingFare,
                ...data,
                associationCode: generateAssociationCode(data.originStopId, data.destinationStopId),
              }
            : f
        )
      )
    } else {
      const newFare: Fare = {
        id: crypto.randomUUID(),
        ...data,
        associationCode: generateAssociationCode(data.originStopId, data.destinationStopId),
      }
      setFares((prev) => [...prev, newFare])
    }
  }

  const handleEdit = (fare: Fare) => {
    setEditingFare(fare)
    setIsFormOpen(true)
  }

  const handleDelete = (id: string) => {
    setFares((prev) => prev.filter((f) => f.id !== id))
  }

  useEffect(() => {
    setFares(generateMockFares())
  }, [])

  return (
    <div className="@container w-full max-w-5xl mx-auto px-4 py-6 space-y-4">
      <FareControls
        onSearch={(value) => {
          setSearchTerm(value)
          setCurrentPage(1)
        }}
        onCreate={handleCreate}
      />

      <FareList
        fares={paginatedFares}
        stops={MOCK_STOPS}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <FarePagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        itemsPerPage={itemsPerPage}
        setItemsPerPage={setItemsPerPage}
        totalItems={filteredFares.length}
      />

      <FareForm
        open={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleSubmit}
        stops={MOCK_STOPS}
        editingTariff={editingFare}
      />
    </div>
  )
}

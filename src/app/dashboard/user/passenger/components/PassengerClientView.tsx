"use client"

import { useCallback, useEffect, useState } from "react"
import { PassengerUserItemRS } from "../types/passenger"
import { PassengerTable } from "./PassengerTable"
import { bulkDeletePassengers, getPassengersPaged } from "../lib/api"
import { PassengerRefreshProvider } from "./PassengerRefreshContext"

export default function PassengerClientView() {
  const [pageIndex, setPageIndex] = useState(0)
  const [pageSize, setPageSize] = useState(10)
  const [totalItems, setTotalItems] = useState(0)
  const [passengers, setPassengers] = useState<PassengerUserItemRS[]>([])

  const fetchData = useCallback(async (page = pageIndex, size = pageSize) => {
    try {
      const res = await getPassengersPaged(page, size)
      if(res.data){
        setPassengers(res.data.passengers)
        setTotalItems(res.data.totalItems)
      } else {
        console.error("Error en la respuesta del servidor:", res.errors ?? res.message)
        setPassengers([])
        setTotalItems(0)
      }
    } catch (error) {
      console.error("Error al obtener pasajeros:", error)
      setPassengers([])
      setTotalItems(0)
    }
  }, [pageIndex, pageSize])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const handleDeleteSelected = async (ids: number[]) => {
    try {
      const payload = { ids } 
      await bulkDeletePassengers(payload)
      const newTotal = totalItems - ids.length
      const lastPage = Math.max(0, Math.ceil(newTotal / pageSize) - 1)

      if (pageIndex > lastPage) {
        setPageIndex(lastPage)
      } else {
        fetchData()
      }
    } catch (err) {
      console.error("❌ Error al eliminar:", err)
    }
  }

  return (
    <div className="@container px-2 sm:px-4 md:px-6">
      <PassengerRefreshProvider value={fetchData}>
        <PassengerTable
          data={passengers}
          totalItems={totalItems}
          pageIndex={pageIndex}
          pageSize={pageSize}
          onPaginationChange={(index, size) => {
            setPageIndex(index)
            setPageSize(size)
          }}
          onDeleteSelected={handleDeleteSelected}
        />
      </PassengerRefreshProvider>
    </div>
  )
}

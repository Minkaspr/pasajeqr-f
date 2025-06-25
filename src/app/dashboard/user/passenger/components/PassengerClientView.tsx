"use client"

import { useEffect, useState } from "react"
import { PassengerMockItem  } from "./passenger"
import { getPassengers } from "./mockPassengers"
import { PassengerTable } from "./PassengerTable"

export default function PassengerClientView() {
  const [passengers, setPassengers] = useState<PassengerMockItem []>([])
  const [pageIndex, setPageIndex] = useState(0)
  const [pageSize, setPageSize] = useState(10)

  useEffect(() => {
    const all = getPassengers()
    const start = pageIndex * pageSize
    const end = start + pageSize
    setPassengers(all.slice(start, end))
  }, [pageIndex, pageSize])

  return (
    <div className="@container px-2 sm:px-4 md:px-6">
      <PassengerTable
        data={passengers}
        totalItems={getPassengers().length}
        pageIndex={pageIndex}
        pageSize={pageSize}
        onPaginationChange={(index, size) => {
          setPageIndex(index)
          setPageSize(size)
        }}
      />
    </div>
  )
}

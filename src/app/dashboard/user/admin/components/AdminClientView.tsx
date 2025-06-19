"use client"

import { useCallback, useEffect, useState } from "react"
import { AdminListItem } from "./admin"
import { getAdmins } from "./mockAdmins"

import { AdminTable } from "./AdminTable"
import { AdminRefreshProvider } from "./AdminRefreshContext"

export default function AdminClientView() {
  const [admins, setAdmins] = useState<AdminListItem[]>([])
  const [searchTerm] = useState("")
  const [pageIndex, setPageIndex] = useState(0)
  const [pageSize, setPageSize] = useState(10)

  const fetchData = useCallback(() => {
    const all = getAdmins()

    const filtered = searchTerm
      ? all.filter((admin) =>
          admin.dni.includes(searchTerm) ||
          admin.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          admin.lastName.toLowerCase().includes(searchTerm.toLowerCase())
        )
      : all

    const start = pageIndex * pageSize
    const end = start + pageSize
    setAdmins(filtered.slice(start, end))
  }, [searchTerm, pageIndex, pageSize])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const totalItems = getAdmins().filter((admin) =>
    admin.dni.includes(searchTerm) ||
    admin.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    admin.lastName.toLowerCase().includes(searchTerm.toLowerCase())
  ).length

  const handlePaginationChange = (newPage: number, newSize: number) => {
    setPageIndex(newPage)
    setPageSize(newSize)
  }

  const handleDeleteSelected = async (ids: number[]) => {
    ids.forEach((id) => {
      const index = getAdmins().findIndex((a) => a.id === id)
      if (index !== -1) getAdmins().splice(index, 1)
    })
    fetchData()
  }

  return (
    <AdminRefreshProvider>
      <AdminTable
        data={admins}
        totalItems={totalItems}
        pageIndex={pageIndex}
        pageSize={pageSize}
        onPaginationChange={handlePaginationChange}
        onDeleteSelected={handleDeleteSelected}
      />
    </AdminRefreshProvider>
  )
}
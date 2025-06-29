"use client"

import { useCallback, useEffect, useState } from "react"
import { AdminTable } from "./AdminTable"
import { AdminRefreshProvider } from "./AdminRefreshContext"

import type { AdminUserItemRS } from '../types/admin'
import { getAdminsPaged, bulkDeleteAdmins, deleteAdmin } from '../lib/api'

export default function AdminClientView() {
  const [pageIndex, setPageIndex] = useState(0)
  const [pageSize, setPageSize] = useState(10)
  const [totalItems, setTotalItems] = useState(0)
  const [admins, setAdmins] = useState<AdminUserItemRS[]>([])

  const fetchData = useCallback(async () => {
    try {
      const res = await getAdminsPaged(pageIndex, pageSize)

      if (res.data) {
        console.log("✅ Respuesta:", JSON.stringify(res.data, null, 2))
        setAdmins(res.data.admins)
        setTotalItems(res.data.totalItems)
      } else {
        console.error("❌ Error en la respuesta del servidor:", res.errors ?? res.message)
        setAdmins([]) 
        setTotalItems(0)
      }
    } catch (err) {
      console.error("❌ Error de red o del servidor:", err)
      setAdmins([])
      setTotalItems(0)
    }
  }, [pageIndex, pageSize])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const handlePaginationChange = (newPage: number, newSize: number) => {
    setPageIndex(newPage)
    setPageSize(newSize)
  }

  /* const handleDeleteSelected = async (ids: number[]) => {
    ids.forEach((id) => {
      const index = getAdmins().findIndex((a) => a.id === id)
      if (index !== -1) getAdmins().splice(index, 1)
    })
    fetchData()
  } */

  const handleDeleteSelected = async (ids: number[]) => {
    try {
      if (ids.length === 1) {
        // Eliminar un solo admin
        await deleteAdmin(ids[0])
      } else if (ids.length > 1) {
        // Eliminar en lote
        const payload = { ids } // BulkDeleteRQ: { ids: number[] }
        await bulkDeleteAdmins(payload)
      }

      // Recargar datos después de eliminar
      fetchData()
    } catch (err) {
      console.error("❌ Error al eliminar:", err)
    }
  }

  return (
    <div className="@container px-2 sm:px-4 md:px-6"> 
      <AdminRefreshProvider value={fetchData}>
        <AdminTable
          data={admins}
          totalItems={totalItems}
          pageIndex={pageIndex}
          pageSize={pageSize}
          onPaginationChange={handlePaginationChange}
          onDeleteSelected={handleDeleteSelected}
        />
      </AdminRefreshProvider>
    </div>
  )
}
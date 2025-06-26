"use client"

import { createContext, useContext, useState, ReactNode } from "react"

type AdminRefreshContextType = () => void

const AdminRefreshContext = createContext<AdminRefreshContextType>(() => {})

export function useAdminRefresh() {
  return useContext(AdminRefreshContext)
}

export function AdminRefreshProvider({ children }: { children: ReactNode }) {
  const [, setVersion] = useState(0)

  const refresh = () => setVersion((v) => v + 1)

  return (
    <AdminRefreshContext.Provider value={refresh}>
      {children}
    </AdminRefreshContext.Provider>
  )
}

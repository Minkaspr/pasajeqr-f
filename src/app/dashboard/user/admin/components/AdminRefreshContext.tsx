'use client'

import { createContext, useContext } from 'react'

type RefreshFunction = (page?: number, size?: number) => Promise<void>

const AdminRefreshContext = createContext<RefreshFunction>(() => {
  throw new Error("AdminRefreshContext usado fuera del proveedor")
})

export const AdminRefreshProvider = AdminRefreshContext.Provider

export const useAdminRefresh = () => useContext(AdminRefreshContext)

'use client'

import { createContext, useContext } from 'react'

type RefreshFunction = (page?: number, size?: number) => Promise<void>

const PassengerRefreshContext = createContext<RefreshFunction>(() => {
  throw new Error("PassengerRefreshContext usado fuera del proveedor")
})

export const PassengerRefreshProvider = PassengerRefreshContext.Provider

export const usePassengerRefresh = () => useContext(PassengerRefreshContext)

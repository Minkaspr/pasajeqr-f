"use client"

import { createContext, useContext, useState, ReactNode } from "react"

type PassengerRefreshContextType = () => void

const PassengerRefreshContext = createContext<PassengerRefreshContextType>(() => {})

export function usePassengerRefresh() {
  return useContext(PassengerRefreshContext)
}

export function PassengerRefreshProvider({ children }: { children: ReactNode }) {
  const [, setVersion] = useState(0)

  const refresh = () => setVersion((v) => v + 1)

  return (
    <PassengerRefreshContext.Provider value={refresh}>
      {children}
    </PassengerRefreshContext.Provider>
  )
}

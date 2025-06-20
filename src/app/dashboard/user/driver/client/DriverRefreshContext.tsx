'use client';
import { createContext, useContext } from 'react';

type RefreshFunction = (page?: number, size?: number) => Promise<void>;

const DriverRefreshContext = createContext<RefreshFunction>(() => {
  throw new Error("DriverRefreshContext usado fuera del proveedor");
});

export const DriverRefreshProvider = DriverRefreshContext.Provider;

export const useDriverRefresh = () => useContext(DriverRefreshContext);

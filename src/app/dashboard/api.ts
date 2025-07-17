import { ApiResponse } from "@/types/api-response"

import { DashboardStatsRS, DriverStatusCountRS, TransactionSummaryRS } from "./dashboard"

const BASE_USER_URL = `${process.env.NEXT_PUBLIC_API_V1_URL}/user`
const BASE_TRANSACTION_URL= `${process.env.NEXT_PUBLIC_API_V1_URL}/transactions`
const BASE_DRIVER_URL = `${process.env.NEXT_PUBLIC_API_V1_URL}/drivers`


/**
 * Obtener estadísticas de usuarios (pasajeros y conductores)
 */
export async function getUserDashboardStats(): Promise<ApiResponse<DashboardStatsRS>> {

  const res = await fetch(`${BASE_USER_URL}/stats`)

  
  if (!res.ok) {
    const errorText = await res.text()
    throw new Error(`Error al obtener estadísticas: ${res.status} - ${errorText}`)
  }

  const data = await res.json()
  return data
}


/**
 * Obtener resumen de transacciones (recargas y pagos) de los últimos 7 días
 */
export async function getTransactionSummaryLast7Days(): Promise<ApiResponse<TransactionSummaryRS>> {
  const res = await fetch(`${BASE_TRANSACTION_URL}/summary/last-7-days`)

  if (!res.ok) {
    const errorText = await res.text()
    throw new Error(`Error al obtener resumen de transacciones: ${res.status} - ${errorText}`)
  }

  const data = await res.json()
  return data
}

export async function fetchDriverStatusSummary(): Promise<ApiResponse<DriverStatusCountRS[]>> {
  const res = await fetch(`${BASE_DRIVER_URL}/status-summary`)
  if (!res.ok) {
    const errorText = await res.text()
    throw new Error(`Error al obtener resumen de conductores: ${res.status} - ${errorText}`)
  }
  return res.json()
}


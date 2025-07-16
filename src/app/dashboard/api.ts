import { ApiResponse } from "@/types/api-response"
import { DashboardStatsRS } from "./dashboard"

const BASE_URL = `${process.env.NEXT_PUBLIC_API_V1_URL}/user`

/**
 * Obtener estadísticas de usuarios (pasajeros y conductores)
 */
export async function getUserDashboardStats(): Promise<ApiResponse<DashboardStatsRS>> {
  const res = await fetch(`${BASE_URL}/stats`)
  
  if (!res.ok) {
    const errorText = await res.text()
    throw new Error(`Error al obtener estadísticas: ${res.status} - ${errorText}`)
  }

  const data = await res.json()
  return data
}

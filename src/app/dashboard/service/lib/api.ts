import { ApiResponse } from "@/types/api-response"
import { BulkDeleteRQ, BulkDeleteRS } from "@/types/bulk-delete"
import { TripsRS, TripDetailRS } from "../types/service"
import { TripCreateRQ, TripUpdateRQ } from "../types/service.schemas"

const BASE_URL = `${process.env.NEXT_PUBLIC_API_V1_URL}/services`

/**
 * Obtener servicios paginados con búsqueda opcional por código
 */
export async function getTripsPaged(
  page = 0,
  size = 10,
  code: string = ""
): Promise<ApiResponse<TripsRS>> {
  const params = new URLSearchParams()
  params.append("page", page.toString())
  params.append("size", size.toString())
  if (code.trim()) {
    params.append("code", code.trim())
  }

  const res = await fetch(`${BASE_URL}?${params.toString()}`)
  if (!res.ok) {
    const errorText = await res.text()
    throw new Error(`Error al obtener servicios: ${res.status} - ${errorText}`)
  }

  return await res.json()
}

/**
 * Obtener un servicio por ID
 */
export async function getTripById(id: number): Promise<ApiResponse<TripDetailRS>> {
  const res = await fetch(`${BASE_URL}/${id}`)
  const responseBody = await res.json()

  if (!res.ok) {
    throw new Error(`Error al obtener servicio: ${responseBody.message || res.status}`)
  }

  return responseBody
}

/**
 * Crear un nuevo servicio
 */
export async function createTrip(data: TripCreateRQ): Promise<ApiResponse<TripDetailRS>> {
  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  })

  const responseBody = await res.json()
  if (!res.ok) {
    throw new Error(`Error al crear servicio: ${responseBody.message || res.status}`)
  }

  return responseBody
}

/**
 * Actualizar un servicio existente
 */
export async function updateTrip(id: number, data: TripUpdateRQ): Promise<ApiResponse<TripDetailRS>> {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  })

  const responseBody = await res.json()
  if (!res.ok) {
    throw new Error(`Error al actualizar servicio: ${responseBody.message || res.status}`)
  }

  return responseBody
}

/**
 * Eliminar un servicio por ID
 */
export async function deleteTrip(id: number): Promise<void> {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "DELETE"
  })

  if (!res.ok) {
    const errorText = await res.text()
    throw new Error(`Error al eliminar servicio: ${errorText || res.status}`)
  }
}

/**
 * Eliminación masiva de servicios
 */
export async function bulkDeleteTrips(data: BulkDeleteRQ): Promise<ApiResponse<BulkDeleteRS>> {
  const res = await fetch(`${BASE_URL}/bulk-delete`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  })

  const responseBody = await res.json()
  if (!res.ok) {
    throw new Error(`Error al eliminar servicios en lote: ${responseBody.message || res.status}`)
  }

  return responseBody
}
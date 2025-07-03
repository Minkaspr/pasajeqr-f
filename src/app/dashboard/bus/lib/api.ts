import { ApiResponse } from "@/types/api-response"
import { BulkDeleteRQ, BulkDeleteRS } from "@/types/bulk-delete"
import { BusesRS, BusDetailRS } from "../types/bus"
import { BusCreateRQ, BusUpdateRQ } from "../types/bus.schema"

const BASE_URL = `${process.env.NEXT_PUBLIC_API_V1_URL}/buses`

/**
 * Obtener buses paginados con búsqueda opcional
 */
export async function getBusesPaged(
  page = 0,
  size = 10,
  search: string = ""
): Promise<ApiResponse<BusesRS>> {
  const params = new URLSearchParams()
  params.append("page", page.toString())
  params.append("size", size.toString())
  if (search.trim()) {
    params.append("search", search.trim())
  }

  const res = await fetch(`${BASE_URL}?${params.toString()}`)
  if (!res.ok) {
    const errorText = await res.text()
    throw new Error(`Error al obtener buses: ${res.status} - ${errorText}`)
  }

  const data = await res.json()
  return data
}

/**
 * Obtener un bus por ID
 */
export async function getBusById(id: number): Promise<ApiResponse<BusDetailRS>> {
  const res = await fetch(`${BASE_URL}/${id}`)
  const responseBody = await res.json()

  if (!res.ok) {
    throw new Error(`Error al obtener bus: ${responseBody.message || res.status}`)
  }

  return responseBody
}

/**
 * Crear un nuevo bus
 */
export async function createBus(data: BusCreateRQ): Promise<ApiResponse<BusDetailRS>> {
  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })

  const responseBody = await res.json()

  if (!res.ok) {
    throw new Error(`Error al crear bus: ${responseBody.message || res.status}`)
  }

  return responseBody
}

/**
 * Actualizar un bus existente
 */
export async function updateBus(id: number, data: BusUpdateRQ): Promise<ApiResponse<BusDetailRS>> {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })

  const responseBody = await res.json()

  if (!res.ok) {
    throw new Error(`Error al actualizar bus: ${responseBody.message || res.status}`)
  }

  return responseBody
}

/**
 * Eliminar un bus por ID
 */
export async function deleteBus(id: number): Promise<void> {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "DELETE",
  })

  if (!res.ok) {
    const errorText = await res.text()
    throw new Error(`Error al eliminar bus: ${errorText || res.status}`)
  }
}

/**
 * Eliminación masiva de buses
 */
export async function bulkDeleteBuses(data: BulkDeleteRQ): Promise<ApiResponse<BulkDeleteRS>> {
  const res = await fetch(`${BASE_URL}/bulk-delete`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })

  const responseBody = await res.json()

  if (!res.ok) {
    throw new Error(`Error al eliminar buses en lote: ${responseBody.message || res.status}`)
  }

  return responseBody
}
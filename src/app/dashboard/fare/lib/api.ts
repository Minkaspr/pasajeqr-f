import { ApiResponse } from "@/types/api-response"
import { BulkDeleteRQ, BulkDeleteRS } from "@/types/bulk-delete"
import { FaresRS, FareDetailRS } from "../types/fare"
import { FareCreateRQ, FareUpdateRQ } from "../types/fare.schemas"

const BASE_URL = `${process.env.NEXT_PUBLIC_API_V1_URL}/fares`

/**
 * Obtener tarifas paginadas con búsqueda opcional
 */
export async function getFaresPaged(
  page = 0,
  size = 10,
  search: string = ""
): Promise<ApiResponse<FaresRS>> {
  const params = new URLSearchParams()
  params.append("page", page.toString())
  params.append("size", size.toString())
  if (search.trim()) {
    params.append("search", search.trim())
  }

  const res = await fetch(`${BASE_URL}?${params.toString()}`)
  if (!res.ok) {
    const errorText = await res.text()
    throw new Error(`Error al obtener tarifas: ${res.status} - ${errorText}`)
  }

  const data = await res.json()
  return data
}

/**
 * Obtener una tarifa por ID
 */
export async function getFareById(id: number): Promise<ApiResponse<FareDetailRS>> {
  const res = await fetch(`${BASE_URL}/${id}`)
  const responseBody = await res.json()

  if (!res.ok) {
    throw new Error(`Error al obtener tarifa: ${responseBody.message || res.status}`)
  }

  return responseBody
}

/**
 * Crear una nueva tarifa
 */
export async function createFare(data: FareCreateRQ): Promise<ApiResponse<FareDetailRS>> {
  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })

  const responseBody = await res.json()

  if (!res.ok) {
    throw new Error(`Error al crear tarifa: ${responseBody.message || res.status}`)
  }

  return responseBody
}

/**
 * Actualizar una tarifa existente
 */
export async function updateFare(id: number, data: FareUpdateRQ): Promise<ApiResponse<FareDetailRS>> {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })

  const responseBody = await res.json()

  if (!res.ok) {
    throw new Error(`Error al actualizar tarifa: ${responseBody.message || res.status}`)
  }

  return responseBody
}

/**
 * Eliminar una tarifa por ID
 */
export async function deleteFare(id: number): Promise<void> {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "DELETE",
  })

  if (!res.ok) {
    const errorText = await res.text()
    throw new Error(`Error al eliminar tarifa: ${errorText || res.status}`)
  }
}

/**
 * Eliminación masiva de tarifas
 */
export async function bulkDeleteFares(data: BulkDeleteRQ): Promise<ApiResponse<BulkDeleteRS>> {
  const res = await fetch(`${BASE_URL}/bulk-delete`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })

  const responseBody = await res.json()

  if (!res.ok) {
    throw new Error(`Error al eliminar tarifas en lote: ${responseBody.message || res.status}`)
  }

  return responseBody
}
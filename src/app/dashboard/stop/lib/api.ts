import { ApiResponse } from "@/types/api-response";
import { BulkDeleteRQ, BulkDeleteRS } from "@/types/bulk-delete";
import { StopsRS, StopDetailRS } from "../types/stop";
import { StopCreateRQ, StopUpdateRQ } from "../types/stop.schemas";

const BASE_URL = `${process.env.NEXT_PUBLIC_API_V1_URL}/stops`;

/**
 * Obtener paraderos paginados
 */
export async function getStopsPaged(
  page = 0,
  size = 10,
  search: string = ""
): Promise<ApiResponse<StopsRS>> {
  const params = new URLSearchParams();
  params.append("page", page.toString());
  params.append("size", size.toString());
  if (search.trim()) {
    params.append("search", search.trim());
  }

  const res = await fetch(`${BASE_URL}?${params.toString()}`);
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Error al obtener paraderos: ${res.status} - ${errorText}`);
  }

  const data = await res.json();
  return data;
}

/**
 * Obtener paraderos terminales paginados
 */
export async function getTerminalStopsPaged(
  page = 0,
  size = 10
): Promise<ApiResponse<StopsRS>> {
  const params = new URLSearchParams();
  params.append("page", page.toString());
  params.append("size", size.toString());

  const res = await fetch(`${BASE_URL}/terminals?${params.toString()}`);
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Error al obtener terminales: ${res.status} - ${errorText}`);
  }

  const data = await res.json();
  return data;
}

/**
 * Obtener un paradero por ID
 */
export async function getStopById(id: number): Promise<ApiResponse<StopDetailRS>> {
  const res = await fetch(`${BASE_URL}/${id}`);
  const responseBody = await res.json();

  if (!res.ok) {
    throw new Error(`Error al obtener paradero: ${responseBody.message || res.status}`);
  }

  return responseBody;
}

/**
 * Crear un nuevo paradero
 */
export async function createStop(data: StopCreateRQ): Promise<ApiResponse<StopDetailRS>> {
  const res = await fetch(BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  const responseBody = await res.json();

  if (!res.ok) {
    throw new Error(`Error al crear paradero: ${responseBody.message || res.status}`);
  }

  return responseBody;
}

/**
 * Actualizar un paradero existente
 */
export async function updateStop(id: number, data: StopUpdateRQ): Promise<ApiResponse<StopDetailRS>> {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  const responseBody = await res.json();

  if (!res.ok) {
    throw new Error(`Error al actualizar paradero: ${responseBody.message || res.status}`);
  }

  return responseBody;
}

/**
 * Eliminar un paradero por ID
 */
export async function deleteStop(id: number): Promise<void> {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: 'DELETE',
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Error al eliminar paradero: ${errorText || res.status}`);
  }
}

/**
 * Eliminación masiva de paraderos
 */
export async function bulkDeleteStops(data: BulkDeleteRQ): Promise<ApiResponse<BulkDeleteRS>> {
  const res = await fetch(`${BASE_URL}/bulk-delete`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  const responseBody = await res.json();

  if (!res.ok) {
    throw new Error(`Error al eliminar paraderos en lote: ${responseBody.message || res.status}`);
  }

  return responseBody;
}
import { ApiResponse, OneErrorResponse } from "@/types/api-response";
import { BulkDeleteRequest, BulkDeleteResponseDTO, ChangeStatusRequest, DriverDetailDTO, DriverRegisterRequest, DriversListData, DriverUpdateRequest } from "@/types/driver"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1";

export interface GetDriversParams {
  page?: number
  size?: number
  search?: string
}

// Obtener lista de conductores con paginación y búsqueda
export async function getDrivers(
  params: GetDriversParams = {}
): Promise<DriversListData> {
  const { page = 0, size = 10, search } = params;

  const queryParams = new URLSearchParams({
    page: page.toString(),
    size: size.toString(),
  });

  if (search && search.trim()) {
    queryParams.set("search", search.trim());
  }

  const url = `${API_URL}/drivers?${queryParams.toString()}`;

  const res = await fetch(url, {
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    throw new Error("Error al obtener conductores");
  }

  const json: ApiResponse<DriversListData> = await res.json();

  if (!json.data) {
    throw new Error(
      json.errors ? JSON.stringify(json.errors) : "Respuesta sin datos"
    );
  }

  return json.data;
}

// Obtener un conductor por ID
export async function getDriverById(id: number): Promise<DriverDetailDTO> {
  const res = await fetch(`${API_URL}/drivers/${id}`, {
    cache: "no-store", // evita cache si se requiere dato en tiempo real
  });

  if (!res.ok) {
    throw new Error("Error al obtener el conductor");
  }

  const json: ApiResponse<DriverDetailDTO> = await res.json();

  if (!json.data) {
    throw new Error(
      json.errors ? JSON.stringify(json.errors) : "Respuesta sin datos"
    );
  }

  return json.data;
}

export async function updateDriver(
  id: number,
  data: DriverUpdateRequest
): Promise<DriverDetailDTO> {
  const res = await fetch(`${API_URL}/drivers/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error("Error al actualizar el conductor");
  }

  const json: ApiResponse<DriverDetailDTO> = await res.json();

  if (!json.data) {
    throw new Error(
      json.errors ? JSON.stringify(json.errors) : "Respuesta sin datos"
    );
  }

  return json.data;
}

// Crear un nuevo conductor
export async function createDriver(
  data: DriverRegisterRequest
): Promise<DriverDetailDTO> {
  const res = await fetch(`${API_URL}/drivers`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const json: ApiResponse<DriverDetailDTO> = await res.json();
  
  if (!res.ok) {
  let message = "Error desconocido";

  if (typeof json.errors === "string") {
    message = json.errors;
  } else if (
    json.errors &&
    typeof json.errors === "object" &&
    "error" in json.errors
  ) {
    // Caso OneErrorResponse
    message = (json.errors as OneErrorResponse).error;
  } else if (Array.isArray(json.errors)) {
    // Podrías mostrar solo el primer error de campo si lo deseas
    const firstFieldError = json.errors[0];
    if (firstFieldError && firstFieldError.messages.length > 0) {
      message = firstFieldError.messages[0];
    }
  } else if (json.message) {
    message = json.message;
  }

  throw new Error(message);
}

  if (!json.data) {
    throw new Error(
      json.errors ? JSON.stringify(json.errors) : "Respuesta sin datos"
    );
  }

  return json.data;
}

export async function changeDriverStatus(id: number, payload: ChangeStatusRequest) {
  const res = await fetch(`${API_URL}/drivers/${id}/status`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error("Error al cambiar el estado del conductor");
  }

  return res.json(); // puede ajustar si necesitas tipar la respuesta también
}

export async function deleteDriver(id: number): Promise<void> {
  const res = await fetch(`${API_URL}/drivers/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    console.error("Error al eliminar el conductor:", errorData);
    throw new Error("No se pudo eliminar el conductor");
  }
}

export async function deleteMultipleDrivers(
  payload: BulkDeleteRequest
): Promise<ApiResponse<BulkDeleteResponseDTO>> {
  const res = await fetch(`${API_URL}/drivers/bulk-delete`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    console.error("Error en eliminación múltiple de conductores:", errorData);
    throw new Error("No se pudieron eliminar los conductores");
  }

  return res.json();
}
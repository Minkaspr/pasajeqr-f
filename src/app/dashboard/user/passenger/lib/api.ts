import type { ApiResponse } from '@/types/api-response';
import type {
  PassengerDetailRS,
  PassengersRS,
} from '../types/passenger';
import type {
  PassengerCreateRQ,
  PassengerUpdateRQ,
} from '../types/passenger.schema';
import type { ChangePasswordRQ } from '@/types/change-password';
import type { UserStatusRQ, UserStatusRS } from '@/types/user-status';
import type { BulkDeleteRQ, BulkDeleteRS } from '@/types/bulk-delete';

const BASE_URL = `${process.env.NEXT_PUBLIC_API_V1_URL}/passengers`;

export async function getPassengersPaged(page = 0, size = 10): Promise<ApiResponse<PassengersRS>> {
  const res = await fetch(`${BASE_URL}?page=${page}&size=${size}`);

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Error al obtener pasajeros: ${res.status} - ${errorText}`);
  }

  const data = await res.json();
  return data;
}

export async function createPassenger(data: PassengerCreateRQ): Promise<ApiResponse<PassengerDetailRS>> {
  const res = await fetch(BASE_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  const responseBody = await res.json();

  if (!res.ok) {
    console.error("❌ Error al crear pasajero:", {
      status: res.status,
      statusText: res.statusText,
      response: responseBody,
    });
    throw new Error(`Error al crear pasajero: ${responseBody.message || res.status}`);
  }

  return responseBody;
}

export async function getPassengerById(id: number): Promise<ApiResponse<PassengerDetailRS>> {
  const res = await fetch(`${BASE_URL}/${id}`);

  const responseBody = await res.json();

  if (!res.ok) {
    throw new Error(`Error al obtener pasajero: ${responseBody.message || res.status}`);
  }

  return responseBody;
}

export async function updatePassenger(id: number, data: PassengerUpdateRQ): Promise<ApiResponse<PassengerDetailRS>> {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  const responseBody = await res.json();

  if (!res.ok) {
    console.error("❌ Error al actualizar pasajero:", {
      status: res.status,
      statusText: res.statusText,
      response: responseBody,
    });
    throw new Error(`Error al actualizar pasajero: ${responseBody.message || res.status}`);
  }

  return responseBody;
}

export async function changePassengerPassword(id: number, data: ChangePasswordRQ): Promise<ApiResponse<null>> {
  const res = await fetch(`${BASE_URL}/${id}/password`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  const responseBody = await res.json();

  if (!res.ok) {
    throw new Error(`Error al cambiar contraseña: ${responseBody.message || res.status}`);
  }

  return responseBody;
}

export async function changePassengerStatus(id: number, data: UserStatusRQ): Promise<ApiResponse<UserStatusRS>> {
  const res = await fetch(`${BASE_URL}/${id}/status`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  const responseBody = await res.json();

  if (!res.ok) {
    throw new Error(`Error al cambiar el estado del pasajero: ${responseBody.message || res.status}`);
  }

  return responseBody;
}

export async function deletePassenger(id: number): Promise<void> {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: 'DELETE',
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Error al eliminar pasajero: ${errorText || res.status}`);
  }
}

export async function bulkDeletePassengers(data: BulkDeleteRQ): Promise<ApiResponse<BulkDeleteRS>> {
  const res = await fetch(`${BASE_URL}/bulk-delete`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  const responseBody = await res.json();

  if (!res.ok) {
    throw new Error(`Error al eliminar en lote: ${responseBody.message || res.status}`);
  }

  return responseBody;
}

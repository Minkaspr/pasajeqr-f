import type { ApiResponse } from '@/types/api-response';
import type { AdminDetailRS, AdminsRS } from '../types/admin';
import type { AdminCreateRQ, AdminUpdateRQ } from '../types/admin.schema';
import type { ChangePasswordRQ } from '@/types/change-password';
import type { UserStatusRQ, UserStatusRS } from '@/types/user-status';
import type { BulkDeleteRQ, BulkDeleteRS } from '@/types/bulk-delete';

const BASE_URL = `${process.env.NEXT_PUBLIC_API_V1_URL}/admins`;

export async function getAdminsPaged(page = 0, size = 10): Promise<ApiResponse<AdminsRS>> {
  const res = await fetch(`${BASE_URL}?page=${page}&size=${size}`);

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Error al obtener administradores: ${res.status} - ${errorText}`);
  }

  const data = await res.json();
  return data;
}

export async function createAdmin(data: AdminCreateRQ): Promise<ApiResponse<AdminDetailRS>> {
  const res = await fetch(BASE_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  const responseBody = await res.json();

  if (!res.ok) {
    throw new Error(`Error al crear administrador: ${responseBody.message || res.status}`);
  }

  return responseBody;
}

export async function getAdminById(id: number): Promise<ApiResponse<AdminDetailRS>> {
  const res = await fetch(`${BASE_URL}/${id}`);

  const responseBody = await res.json();

  if (!res.ok) {
    throw new Error(`Error al obtener administrador: ${responseBody.message || res.status}`);
  }

  return responseBody;
}

export async function updateAdmin(id: number, data: AdminUpdateRQ): Promise<ApiResponse<AdminDetailRS>> {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  const responseBody = await res.json();

  if (!res.ok) {
    throw new Error(`Error al actualizar administrador: ${responseBody.message || res.status}`);
  }

  return responseBody;
}

export async function changeAdminPassword(id: number, data: ChangePasswordRQ): Promise<ApiResponse<null>> {
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

export async function changeAdminStatus(id: number, data: UserStatusRQ): Promise<ApiResponse<UserStatusRS>> {
  const res = await fetch(`${BASE_URL}/${id}/status`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  const responseBody = await res.json();

  if (!res.ok) {
    throw new Error(`Error al cambiar el estado del administrador: ${responseBody.message || res.status}`);
  }

  return responseBody;
}

export async function deleteAdmin(id: number): Promise<void> {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: 'DELETE',
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Error al eliminar administrador: ${errorText || res.status}`);
  }
}

export async function bulkDeleteAdmins(data: BulkDeleteRQ): Promise<ApiResponse<BulkDeleteRS>> {
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
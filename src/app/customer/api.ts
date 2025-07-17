import { ApiResponse } from "@/types/api-response";
import { PassengerBalanceHistory, TripQrValidationRS } from "./customer";

const BASE_PASSENGER_URL = `${process.env.NEXT_PUBLIC_API_V1_URL}/passengers`;

/**
 * Obtener balance y transacciones de un pasajero
 * @param id ID del pasajero
 */
export async function getPassengerBalanceHistory(
  id: number
): Promise<ApiResponse<PassengerBalanceHistory>> {
  const res = await fetch(`${BASE_PASSENGER_URL}/${id}/balance-history`);

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Error al obtener balance: ${res.status} - ${errorText}`);
  }

  const data = await res.json();
  return data;
}

const BASE_SERVICE_URL = `${process.env.NEXT_PUBLIC_API_V1_URL}/services`;

/**
 * Valida un token QR escaneado y retorna la información del servicio
 * @param token Token JWT contenido en el QR
 */
export async function validateTripQrToken(
  token: string
): Promise<ApiResponse<TripQrValidationRS>> {
  const res = await fetch(`${BASE_SERVICE_URL}/validate-qr?token=${token}`);

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Error al validar QR: ${res.status} - ${errorText}`);
  }

  const data = await res.json();
  return data;
}
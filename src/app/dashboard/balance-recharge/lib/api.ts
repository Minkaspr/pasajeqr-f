import type { ApiResponse } from '@/types/api-response';
import { PassengerLookupRS } from '../types/passenger';
import { BalanceTransactionDetailRS, RechargeRQ } from '../types/balance';

const USER_API = `${process.env.NEXT_PUBLIC_API_V1_URL}/user`;
const PASSENGER_API = `${process.env.NEXT_PUBLIC_API_V1_URL}/passengers`;

/**
 * Buscar un pasajero por DNI
 */
export async function getPassengerByDni(dni: string): Promise<ApiResponse<PassengerLookupRS>> {
  const res = await fetch(`${USER_API}/dni/${dni}`);

  const responseBody = await res.json();

  if (!res.ok) {
    throw responseBody;
  }

  return responseBody;
}

/**
 * Recargar saldo a un pasajero
 */
export async function rechargePassengerBalance(id: number, data: RechargeRQ): Promise<ApiResponse<BalanceTransactionDetailRS>> {
  const res = await fetch(`${PASSENGER_API}/${id}/recharge`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  const responseBody = await res.json();

  if (!res.ok) {
    throw new Error(`Error al recargar saldo: ${responseBody.message || res.status}`);
  }

  return responseBody;
}

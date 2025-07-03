/**
 * Representa un paradero en una lista (tabla paginada)
 */
export interface StopItemRS {
  id: number;
  name: string;
  createdAt: string; // ISO string
}

/**
 * Representa la respuesta paginada de paraderos
 */
export interface StopsRS {
  stops: StopItemRS[];
  currentPage: number;
  totalPages: number;
  totalItems: number;
}

/**
 * Representa el detalle completo de un paradero
 */
export interface StopDetailRS {
  id: number;
  name: string;
  createdAt: string; // ISO string
}
/**
 * Representa una tarifa en una lista (tabla paginada)
 */
export interface FareItemRS {
  id: number
  code: string
  originStopName: string
  destinationStopName: string
  price: number
}

/**
 * Representa la respuesta paginada de tarifas
 */
export interface FaresRS {
  fares: FareItemRS[]
  currentPage: number
  totalPages: number
  totalItems: number
}

/**
 * Representa el detalle completo de una tarifa
 */
export interface FareDetailRS {
  id: number
  code: string
  originStopName: string
  destinationStopName: string
  originStopId: number
  destinationStopId: number
  price: number
}

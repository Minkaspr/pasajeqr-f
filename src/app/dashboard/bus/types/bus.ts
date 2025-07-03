export enum BusStatus {
  OPERATIONAL = "OPERATIONAL",
  IN_SERVICE = "IN_SERVICE",
  UNDER_MAINTENANCE = "UNDER_MAINTENANCE",
  OUT_OF_SERVICE = "OUT_OF_SERVICE",
}

/**
 * Representa un bus en una lista (tabla paginada)
 */
export interface BusItemRS {
  id: number
  plate: string
  model: string
  capacity: number
  status: BusStatus
  createdAt: string
}

/**
 * Representa la respuesta paginada de buses
 */
export interface BusesRS {
  buses: BusItemRS[]
  currentPage: number
  totalPages: number
  totalItems: number
}

/**
 * Representa el detalle completo de un bus
 */
export interface BusDetailRS {
  id: number
  plate: string
  model: string
  capacity: number
  status: BusStatus
}
export enum BusStatus {
  OPERATIONAL = "OPERATIONAL",           // Está en buen estado físico y técnico, pero no está en uso ahora.
  IN_SERVICE = "IN_SERVICE",             // Ya está asignado a un servicio activo.
  UNDER_MAINTENANCE = "UNDER_MAINTENANCE", // Está en el taller o fuera de uso por revisión.
  OUT_OF_SERVICE = "OUT_OF_SERVICE",     // Ya no se usa, está dado de baja o fuera de circulación.
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
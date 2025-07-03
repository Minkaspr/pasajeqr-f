import { ServiceStatus } from "./status-config"

/**
 * Representa un servicio en una lista (tabla paginada)
 */
export interface TripItemRS {
  id: number
  code: string
  busPlate: string
  driverName: string
  originStopName: string
  destinationStopName: string
  departureDate: string // formato ISO: YYYY-MM-DD
  departureTime: string // formato: HH:mm:ss
  status: ServiceStatus
}

/**
 * Representa la respuesta paginada de servicios
 */
export interface TripsRS {
  services: TripItemRS[]
  currentPage: number
  totalPages: number
  totalItems: number
}

/**
 * Representa el detalle completo de un servicio
 */
export interface TripDetailRS {
  id: number
  code: string
  busPlate: string
  driverName: string
  originStopName: string
  destinationStopName: string
  departureDateTime: string // formato ISO 8601: YYYY-MM-DDTHH:mm:ss
  arrivalDateTime: string | null // puede ser null si no hay llegada
  status: ServiceStatus
}

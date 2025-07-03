// service/components/types.ts

import { Calendar, Clock, Route, Trash2 } from "lucide-react"

// Enum de estados del servicio
export enum ServiceStatus {
  SCHEDULED = "SCHEDULED",
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
  CANCELED = "CANCELLED",
}

// Configuración de los estados
export const statusConfig = {
  [ServiceStatus.SCHEDULED]: {
    label: "Programado",
    color: "bg-blue-100 text-blue-800 border-blue-200",
    icon: Calendar,
  },
  [ServiceStatus.IN_PROGRESS]: {
    label: "En Ruta",
    color: "bg-yellow-100 text-yellow-800 border-yellow-200",
    icon: Route,
  },
  [ServiceStatus.COMPLETED]: {
    label: "Completado",
    color: "bg-green-100 text-green-800 border-green-200",
    icon: Clock,
  },
  [ServiceStatus.CANCELED]: {
    label: "Cancelado",
    color: "bg-red-100 text-red-800 border-red-200",
    icon: Trash2,
  },
} as const

// Entidad de servicio
export interface ServiceEntity {
  id: string
  serviceCode: string
  busPlate: string
  driverName: string
  originStop: string
  destinationStop: string
  departureTime: Date
  arrivalTime: Date | null
  status: ServiceStatus
  createdAt: Date
}

// Datos del formulario
export interface ServiceFormData {
  serviceCode: string
  busPlate: string
  driverName: string
  originStop: string
  destinationStop: string
  departureDate: string
  departureTime: string
  arrivalDate: string
  arrivalTime: string
  status: ServiceStatus | ""
}

// Errores del formulario
export interface ServiceFormErrors {
  serviceCode?: string
  busPlate?: string
  driverName?: string
  originStop?: string
  destinationStop?: string
  departureDate?: string
  departureTime?: string
  arrivalDate?: string
  arrivalTime?: string
  status?: string
  route?: string
}

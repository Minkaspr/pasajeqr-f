import {
  CheckCircle2,
  BusFront,
  Wrench,
  XCircle,
  LucideIcon,
} from "lucide-react"
import { BusStatus } from "./types/bus"

export const statusConfig: Record<
  BusStatus,
  {
    label: string
    color: string
    icon: LucideIcon
  }
> = {
  OPERATIONAL: {
    label: "Disponible",
    color: "bg-green-100 text-green-800",
    icon: CheckCircle2,
  },
  IN_SERVICE: {
    label: "En servicio",
    color: "bg-blue-100 text-blue-800",
    icon: BusFront,
  },
  UNDER_MAINTENANCE: {
    label: "Mantenimiento",
    color: "bg-yellow-100 text-yellow-900",
    icon: Wrench,
  },
  OUT_OF_SERVICE: {
    label: "Fuera de servicio",
    color: "bg-red-100 text-red-800",
    icon: XCircle,
  },
}

export function getCapacityColor(capacity: number) {
  if (capacity <= 20) return "text-red-600"
  if (capacity <= 35) return "text-yellow-600"
  return "text-green-700"
}

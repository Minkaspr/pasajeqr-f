export type BusStatus =
  | "OPERATIONAL"
  | "IN_SERVICE"
  | "UNDER_MAINTENANCE"
  | "OUT_OF_SERVICE"

export interface Bus {
  id: string
  plate: string
  model: string
  capacity: number
  status: BusStatus
  createdAt: Date 
}

export type NewBus = Omit<Bus, "id" | "createdAt">

export type DashboardStatsRS = {
  // Pasajeros
  totalPassengers: number
  passengerGrowth: number
  todayPassengers: number
  yesterdayPassengers: number
  weeklyPassengers: number

  // Conductores
  totalDrivers: number
  driverGrowth: number
  todayDrivers: number
  yesterdayDrivers: number
  weeklyDrivers: number

  // Vehículos
  totalVehicles: number
  vehicleGrowth: number
  todayVehicles: number
  yesterdayVehicles: number
  weeklyVehicles: number

  // Paraderos
  totalStops: number
  stopGrowth: number
  todayStops: number
  yesterdayStops: number
  weeklyStops: number
}

export interface TransactionSummaryItem {
  date: string
  recargas: number
  pagos: number
}

export interface TransactionSummaryRS {
  data: TransactionSummaryItem[]
}

export type DriverStatus = 'AVAILABLE' | 'ON_SERVICE' | 'OFF_DUTY' | 'SICK_LEAVE'

export interface DriverStatusCountRS {
  status: DriverStatus
  count: number
}


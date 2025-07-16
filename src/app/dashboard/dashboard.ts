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

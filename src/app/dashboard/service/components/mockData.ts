import { ServiceEntity, ServiceStatus } from "../types/status-config"

export function generateMockServices(): ServiceEntity[] {
  const buses = ["ABC-123", "DEF-456", "GHI-789", "JKL-012", "MNO-345"]
  const drivers = ["Juan Pérez", "María López", "Carlos Rodríguez", "Ana García", "Luis Martínez"]
  const stops = [
    "Terminal Central",
    "Plaza Mayor",
    "Hospital Regional",
    "Universidad Nacional",
    "Centro Comercial Norte",
    "Estadio Municipal",
    "Aeropuerto Internacional",
    "Mercado Central",
  ]

  const services: ServiceEntity[] = []

  for (let i = 1; i <= 25; i++) {
    const now = new Date()
    const departureTime = new Date(now)
    departureTime.setHours(6 + Math.floor(Math.random() * 12), Math.floor(Math.random() * 60))
    departureTime.setDate(now.getDate() + Math.floor(Math.random() * 7))

    const arrivalTime = new Date(departureTime)
    arrivalTime.setMinutes(arrivalTime.getMinutes() + 30 + Math.floor(Math.random() * 60))

    const statusValues = Object.values(ServiceStatus)
    const randomStatus = statusValues[Math.floor(Math.random() * statusValues.length)]

    services.push({
      id: String(Date.now() + i + Math.floor(Math.random() * 1000)), // pseudo-random ID, stable in runtime
      serviceCode: `SRV-${String(i).padStart(4, "0")}`,
      busPlate: buses[Math.floor(Math.random() * buses.length)],
      driverName: drivers[Math.floor(Math.random() * drivers.length)],
      originStop: stops[Math.floor(Math.random() * stops.length)],
      destinationStop: stops[Math.floor(Math.random() * stops.length)],
      departureTime,
      arrivalTime: randomStatus === ServiceStatus.COMPLETED ? arrivalTime : null,
      status: randomStatus,
      createdAt: new Date(now.getTime() - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000)),
    })
  }

  return services
}

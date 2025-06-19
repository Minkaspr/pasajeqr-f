import { PassengerCreateSchema } from "./passengerSchema"
import { PassengerListItem, PassengerMockItem } from "./passenger"

// Pasajeros simulados (con balance incluido)
export const mockPassengers: PassengerMockItem[] = [
  {
    id: 1,
    dni: "10000001",
    firstName: "Pedro Luis",
    lastName: "Gómez Ramírez",
    email: "pedro.gomez@example.com",
    balance: 50.0,
    status: true,
    createdAt: "2024-11-01T10:15:00Z",
  },
  {
    id: 2,
    dni: "10000002",
    firstName: "Lucía",
    lastName: "Rojas Sánchez",
    email: "lucia.rojas@example.com",
    balance: 120.5,
    status: true,
    createdAt: "2024-10-15T08:45:00Z",
  },
  {
    id: 3,
    dni: "10000003",
    firstName: "Carlos Eduardo",
    lastName: "Fernández Salazar",
    email: "carlos.fernandez@example.com",
    balance: 80.25,
    status: true,
    createdAt: "2024-09-21T13:30:00Z",
  },
  {
    id: 4,
    dni: "10000004",
    firstName: "María Fernanda",
    lastName: "Lopez Vargas",
    email: "maria.lopez@example.com",
    balance: 200.0,
    status: false,
    createdAt: "2024-08-12T16:10:00Z",
  },
  {
    id: 5,
    dni: "10000005",
    firstName: "Andrés",
    lastName: "Silva Medina",
    email: "andres.silva@example.com",
    balance: 30.75,
    status: true,
    createdAt: "2024-07-03T11:20:00Z",
  },
  {
    id: 6,
    dni: "10000006",
    firstName: "Sofía",
    lastName: "Gonzales Delgado",
    email: "sofia.gonzales@example.com",
    balance: 0,
    status: true,
    createdAt: "2024-06-11T09:50:00Z",
  },
  {
    id: 7,
    dni: "10000007",
    firstName: "Luis Alberto",
    lastName: "Torres Navarro",
    email: "luis.torres@example.com",
    balance: 150.0,
    status: false,
    createdAt: "2024-05-20T14:00:00Z",
  },
  {
    id: 8,
    dni: "10000008",
    firstName: "Valeria",
    lastName: "Fernández Rivas",
    email: "valeria.fernandez@example.com",
    balance: 70.0,
    status: true,
    createdAt: "2024-04-05T12:30:00Z",
  },
  {
    id: 9,
    dni: "10000009",
    firstName: "Miguel Ángel",
    lastName: "Vargas Castillo",
    email: "miguel.vargas@example.com",
    balance: 0.5,
    status: true,
    createdAt: "2024-03-25T07:45:00Z",
  },
  {
    id: 10,
    dni: "10000010",
    firstName: "Camila",
    lastName: "Rojas Cornejo",
    email: "camila.rojas@example.com",
    balance: 25.0,
    status: false,
    createdAt: "2024-02-28T17:20:00Z",
  },
  {
    id: 11,
    dni: "10000011",
    firstName: "Javier",
    lastName: "Navarro Salinas",
    email: "javier.navarro@example.com",
    balance: 42.0,
    status: true,
    createdAt: "2024-02-01T10:10:00Z",
  },
  {
    id: 12,
    dni: "10000012",
    firstName: "Daniela",
    lastName: "Salazar Torres",
    email: "daniela.salazar@example.com",
    balance: 89.5,
    status: true,
    createdAt: "2024-01-12T08:00:00Z",
  },
  {
    id: 13,
    dni: "10000013",
    firstName: "Ricardo Iván",
    lastName: "Campos Delgado",
    email: "ricardo.campos@example.com",
    balance: 133.0,
    status: true,
    createdAt: "2023-12-03T18:30:00Z",
  },
  {
    id: 14,
    dni: "10000014",
    firstName: "Paola",
    lastName: "Mejía Ramírez",
    email: "paola.mejia@example.com",
    balance: 15.25,
    status: false,
    createdAt: "2023-11-20T13:00:00Z",
  },
  {
    id: 15,
    dni: "10000015",
    firstName: "Esteban",
    lastName: "Aguilar Cárdenas",
    email: "esteban.aguilar@example.com",
    balance: 95.0,
    status: true,
    createdAt: "2023-10-10T07:45:00Z",
  },
]

// Inicializar ID
let idCounter = Math.max(...mockPassengers.map((p) => p.id), 0) + 1

// Estado actual de pasajeros
let passengers: PassengerMockItem[] = [...mockPassengers]

// ✅ Consultar todos — devolvemos el tipo más completo (con balance)
export function getPassengers(): PassengerMockItem[] {
  return passengers
}

// Agregar uno nuevo
export function addPassenger(data: PassengerCreateSchema): PassengerListItem {
  const newPassenger: PassengerMockItem = {
    id: idCounter++,
    firstName: data.firstName,
    lastName: data.lastName,
    email: data.email,
    dni: data.dni,
    balance: Number(data.balance),
    status: true,
    createdAt: new Date().toISOString(),
  }

  passengers = [newPassenger, ...passengers]
  return newPassenger
}

// Cambiar estado
export function togglePassengerStatus(id: number) {
  const p = passengers.find((p) => p.id === id)
  if (p) p.status = !p.status
}

// Eliminar
export function deletePassenger(id: number) {
  const index = passengers.findIndex((p) => p.id === id)
  if (index !== -1) {
    passengers.splice(index, 1)
  }
}

// Reset (vaciar)
export function resetPassengers() {
  passengers = []
  idCounter = 1
}

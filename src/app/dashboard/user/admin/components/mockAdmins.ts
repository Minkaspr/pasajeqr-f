import { AdminCreateSchema } from "./adminSchema"
import { AdminListItem, AdminMockItem } from "./admin"

// Tus datos simulados originales
export const mockAdmins: AdminListItem[] = [
  {
    id: 1,
    dni: "12345678",
    firstName: "Carlos Alberto",
    lastName: "Ramírez Torres",
    email: "carlos.ramirez@example.com",
    status: true,
    createdAt: "2024-11-01T10:15:00Z",
  },
  {
    id: 2,
    dni: "23456789",
    firstName: "Lucía",
    lastName: "Martínez Rivas",
    email: "lucia.martinez@example.com",
    status: false,
    createdAt: "2024-10-15T08:45:00Z",
  },
  {
    id: 3,
    dni: "34567890",
    firstName: "Juan Diego",
    lastName: "Pérez Delgado",
    email: "juan.perez@example.com",
    status: true,
    createdAt: "2024-09-21T13:30:00Z",
  },
  {
    id: 4,
    dni: "45678901",
    firstName: "María Fernanda",
    lastName: "López Salazar",
    email: "maria.lopez@example.com",
    status: true,
    createdAt: "2024-08-12T16:10:00Z",
  },
  {
    id: 5,
    dni: "56789012",
    firstName: "Andrés",
    lastName: "Silva Cárdenas",
    email: "andres.silva@example.com",
    status: false,
    createdAt: "2024-07-03T11:20:00Z",
  },
  {
    id: 6,
    dni: "67890123",
    firstName: "Sofía",
    lastName: "Gonzales Medina",
    email: "sofia.gonzales@example.com",
    status: true,
    createdAt: "2024-06-11T09:50:00Z",
  },
  {
    id: 7,
    dni: "78901234",
    firstName: "Luis Enrique",
    lastName: "Torres Paredes",
    email: "luis.torres@example.com",
    status: true,
    createdAt: "2024-05-20T14:00:00Z",
  },
  {
    id: 8,
    dni: "89012345",
    firstName: "Valeria",
    lastName: "Fernández Vargas",
    email: "valeria.fernandez@example.com",
    status: true,
    createdAt: "2024-04-05T12:30:00Z",
  },
  {
    id: 9,
    dni: "90123456",
    firstName: "Miguel Ángel",
    lastName: "Vargas Lozano",
    email: "miguel.vargas@example.com",
    status: false,
    createdAt: "2024-03-25T07:45:00Z",
  },
  {
    id: 10,
    dni: "01234567",
    firstName: "Camila",
    lastName: "Rojas Montoya",
    email: "camila.rojas@example.com",
    status: true,
    createdAt: "2024-02-28T17:20:00Z",
  },
  {
    id: 11,
    dni: "11223344",
    firstName: "Ana Paula",
    lastName: "Delgado Torres",
    email: "ana.delgado@example.com",
    status: true,
    createdAt: "2024-01-15T09:30:00Z",
  },
  {
    id: 12,
    dni: "22334455",
    firstName: "Marco",
    lastName: "Sánchez Paredes",
    email: "marco.sanchez@example.com",
    status: false,
    createdAt: "2023-12-10T11:00:00Z",
  },
  {
    id: 13,
    dni: "33445566",
    firstName: "Isabella",
    lastName: "Ramírez Cornejo",
    email: "isabella.ramirez@example.com",
    status: true,
    createdAt: "2023-11-20T16:45:00Z",
  },
  {
    id: 14,
    dni: "44556677",
    firstName: "Jorge Luis",
    lastName: "Morales Salinas",
    email: "jorge.morales@example.com",
    status: false,
    createdAt: "2023-10-05T08:20:00Z",
  },
  {
    id: 15,
    dni: "55667788",
    firstName: "Fernanda",
    lastName: "Castillo Rivas",
    email: "fernanda.castillo@example.com",
    status: true,
    createdAt: "2023-09-01T14:10:00Z",
  },
]

// Inicializar ID y admins con datos reales + birthDate ficticio
let idCounter = Math.max(...mockAdmins.map((a) => a.id), 0) + 1

let admins: AdminMockItem[] = mockAdmins.map((admin) => ({
  ...admin,
  birthDate: "1990-01-01", // Ficticio por ahora
}))

export function getAdmins(): AdminListItem[] {
  return admins
}

export function addAdmin(data: AdminCreateSchema): AdminListItem {
  const newAdmin: AdminMockItem = {
    id: idCounter++,
    firstName: data.firstName,
    lastName: data.lastName,
    email: data.email,
    dni: data.dni,
    status: true,
    createdAt: new Date().toISOString(),
    birthDate: data.birthDate,
  }

  admins = [newAdmin, ...admins]
  return newAdmin
}

export function resetAdmins() {
  admins = []
  idCounter = 1
}

export function toggleAdminStatus(id: number) {
  const admin = admins.find((a) => a.id === id)
  if (admin) {
    admin.status = !admin.status
  }
}

export function deleteAdmin(id: number) {
  const index = admins.findIndex((a) => a.id === id)
  if (index !== -1) {
    admins.splice(index, 1)
  }
}


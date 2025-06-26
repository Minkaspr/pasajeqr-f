export interface AdminListItem {
  id: number
  dni: string
  firstName: string
  lastName: string
  email: string
  status: boolean
  createdAt: string // ISO date string
}

export interface AdminMockItem extends AdminListItem {
  birthDate: string // se mantiene como string ISO
}

export interface AdminDetailDTO {
  id: number
  firstName: string
  lastName: string
  dni: string
  email: string
  birthDate: string
  status: boolean
  createdAt: string // <-- agrega esto
  updatedAt: string // <-- y esto también
}

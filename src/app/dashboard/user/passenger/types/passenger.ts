export interface PassengerUserItemRS {
  id: number
  firstName: string
  lastName: string
  dni: string
  email: string
  status: boolean
  createdAt: string    // ISO datetime
  balance: number      // BigDecimal → number
}

// Respuesta de lista paginada
export interface PassengersRS {
  passengers: PassengerUserItemRS[]
  currentPage: number
  totalPages: number
  totalItems: number
}

// Detalle completo de un pasajero
export interface PassengerDetailRS {
  id: number
  firstName: string
  lastName: string
  dni: string
  email: string
  status: boolean
  createdAt: string    // ISO datetime
  updatedAt: string    // ISO datetime
  balance: number
}

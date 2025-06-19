export interface PassengerListItem {
  id: number
  dni: string
  firstName: string
  lastName: string
  email: string
  status: boolean
  createdAt: string 
}

export interface PassengerMockItem extends PassengerListItem {
  balance: number 
}

export interface PassengerDetailDTO {
  id: number
  firstName: string
  lastName: string
  dni: string
  email: string
  balance: number
  status: boolean
  createdAt: string
  updatedAt: string
}

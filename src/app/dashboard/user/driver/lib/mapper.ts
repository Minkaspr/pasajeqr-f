import { DriverDetailDTO, DriverUpdateRequest } from "@/types/driver"

export const toDriverUpdateRequest = (dto: DriverDetailDTO): DriverUpdateRequest => ({
  firstName: dto.firstName,
  lastName: dto.lastName,
  email: dto.email,
  dni: dto.dni,
  userStatus: dto.status, // este boolean indica si el usuario está activo
  licenseNumber: dto.licenseNumber,
  status: dto.driverStatus, // enum: AVAILABLE, etc.
})

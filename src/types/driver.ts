export enum DriverStatus {
  AVAILABLE = "AVAILABLE",       // Listo para ser asignado a un servicio.
  ON_SERVICE = "ON_SERVICE",     // Ya está manejando un bus en un servicio actual.
  OFF_DUTY = "OFF_DUTY",         // No está trabajando en este turno.
  SICK_LEAVE = "SICK_LEAVE",     // De baja médica.
}

export interface DriverListItem {
  id: number;
  firstName: string;
  lastName: string;
  dni: string;
  email: string;
  status: boolean;
  createdAt: string; // ISO 8601 string - 
}

export interface AvailableDriverRS {
  id: number;
  firstName: string;
  lastName: string;
}

export interface DriversListData<T> {
  drivers: T[];
  currentPage: number;
  totalPages: number;
  totalItems: number;
}

export interface DriverDetailDTO {
  id: number;
  firstName: string;
  lastName: string;
  dni: string;
  email: string;
  status: boolean;
  createdAt: string;
  updatedAt: string;
  licenseNumber: string;
  driverStatus: DriverStatus; 
}

export interface DriverUpdateRequest {
  firstName: string;
  lastName: string;
  email: string;
  dni: string;
  userStatus: boolean;
  licenseNumber: string;
  status: DriverStatus;
}

export interface DriverRegisterRequest {
  firstName: string;
  lastName: string;
  dni: string;
  email: string;
  password: string;
  licenseNumber: string;
}

export interface ChangeStatusRequest {
  active: boolean;
}

export interface BulkDeleteRequest {
  driverIds: number[];
}

export interface BulkDeleteResponseDTO {
  deletedIds: number[];
  notFoundIds: number[];
}



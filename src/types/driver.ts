// 1. Interfaz para un solo Driver
export interface DriverListItem {
  id: number;
  firstName: string;
  lastName: string;
  dni: string;
  email: string;
  status: boolean;
  createdAt: string; // ISO 8601 string - 
}

// 2. Interfaz para el objeto 'data' dentro de la respuesta de la API de lista de drivers
export interface DriversListData {
  drivers: DriverListItem[];
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

export enum DriverStatus {
  AVAILABLE = "AVAILABLE",
  ON_SERVICE = "ON_SERVICE",
  OFF_DUTY = "OFF_DUTY",
  SICK_LEAVE = "SICK_LEAVE",
}

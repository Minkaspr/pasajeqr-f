export interface AdminUserItemRS {
  id: number;
  firstName: string;
  lastName: string;
  dni: string;
  email: string;
  status: boolean;
  createdAt: string; // ISO string
  birthDate: string; // ISO string (YYYY-MM-DD)
}

export interface AdminsRS {
  admins: AdminUserItemRS[];
  currentPage: number;
  totalPages: number;
  totalItems: number;
}

export interface AdminDetailRS {
  id: number;
  firstName: string;
  lastName: string;
  dni: string;
  email: string;
  status: boolean;
  createdAt: string;  // ISO string
  updatedAt: string;  // ISO string
  birthDate: string;  // ISO string
}

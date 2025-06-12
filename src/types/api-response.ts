export interface FieldErrorResponse {
  field: string;
  messages: string[]; // Lista de mensajes de error para ese campo
}

export interface OneErrorResponse {
  error: string;
}

export interface ApiResponse<T> {
  status: number;
  message: string;
  data: T | null; // Puede ser null si hay errores
  errors: string | FieldErrorResponse | FieldErrorResponse[] | OneErrorResponse | null;
}
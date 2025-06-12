import { z } from "zod";
import { lettersField, digitsField, passwordField, alphanumericCodeField } from "./rules";
import { DriverStatus } from "@/types/driver";

const baseDriverSchema = z.object({
  firstName: lettersField("El nombre", { min: 6, max: 50 }),
  lastName: lettersField("El apellido", { min: 6, max: 50 }),
  email: z
    .string()
    .nonempty("El email es obligatorio")
    .email("Debe ser un email válido"),
  dni: digitsField("El DNI", { exact: 8 }),
  licenseNumber: alphanumericCodeField("El número de licencia", { min: 6, max: 20 }),
});
// ➕ Esquema para creación (requiere password)
export const driverCreateSchema = baseDriverSchema.extend({
  password: passwordField
});

// 🛠️ Esquema para actualización (no requiere password, pero agrega estados)
export const driverUpdateSchema = baseDriverSchema.extend({
  status: z.boolean({ required_error: "El estado del usuario es obligatorio" }),
  driverStatus: z.nativeEnum(DriverStatus, {
    required_error: "El estado del conductor es obligatorio",
  }),
});

// Tipos inferidos
export type DriverCreateSchema = z.infer<typeof driverCreateSchema>;
export type DriverUpdateSchema = z.infer<typeof driverUpdateSchema>;

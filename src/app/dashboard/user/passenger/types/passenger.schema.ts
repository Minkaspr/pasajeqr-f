import { z } from "zod"
import {
  lettersField,
  digitsField,
  passwordField,
} from "@/types/validation-rules"

/**
 * Validación para creación de pasajero
 */
export const passengerCreateSchema = z.object({
  firstName: lettersField("El nombre", { min: 1, max: 50 }),
  lastName: lettersField("El apellido", { min: 1, max: 50 }),
  dni: digitsField("El DNI", { exact: 8 }),
  email: z
    .string()
    .nonempty("El correo es obligatorio")
    .email("El correo electrónico no es válido"),
  password: passwordField,
  balance: z
    .number({
      required_error: "El saldo inicial no puede ser nulo",
      invalid_type_error: "El saldo debe ser un número válido",
    })
    .min(0, "El saldo no puede ser negativo"),

})
export type PassengerCreateRQ = z.infer<typeof passengerCreateSchema>

/**
 * Validación para actualizar pasajero
 */
export const passengerUpdateSchema = z.object({
  firstName: lettersField("El nombre", { min: 3, max: 50 }),
  lastName: lettersField("El apellido", { min: 6, max: 50 }),
  email: z
    .string()
    .nonempty("El correo es obligatorio")
    .email("El correo electrónico no es válido"),
  dni: digitsField("El DNI", { exact: 8 }),
  userStatus: z.boolean({
    required_error: "El estado del usuario es obligatorio",
  })
})
export type PassengerUpdateRQ = z.infer<typeof passengerUpdateSchema>
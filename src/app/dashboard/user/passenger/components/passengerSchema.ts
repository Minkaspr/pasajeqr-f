import { z } from "zod"
import {
  lettersField,
  digitsField,
  passwordField,
} from "./rules"

export const passengerCreateSchema = z.object({
  firstName: lettersField("El nombre", { min: 2, max: 50 }),
  lastName: lettersField("El apellido", { min: 2, max: 50 }),
  dni: digitsField("El DNI", { exact: 8 }),
  email: z
    .string()
    .nonempty("El email es obligatorio")
    .email("Debe ser un email válido"),
  password: passwordField,
  balance: z
    .string()
    .nonempty("El saldo es obligatorio")
    .refine((val) => !isNaN(Number(val)) && Number(val) >= 0, {
      message: "El saldo debe ser un número positivo o cero",
    }),
})

export type PassengerCreateSchema = z.infer<typeof passengerCreateSchema>

export const passengerUpdateSchema = passengerCreateSchema.omit({ password: true }).extend({
  status: z.boolean({
    required_error: "El estado del usuario es obligatorio",
  }),
})

export type PassengerUpdateSchema = z.infer<typeof passengerUpdateSchema>

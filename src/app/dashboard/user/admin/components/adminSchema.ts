import { z } from "zod"
import {
  lettersField,
  digitsField,
  passwordField,
} from "./rules"

export const adminCreateSchema = z.object({
  firstName: lettersField("El nombre", { min: 2, max: 50 }),
  lastName: lettersField("El apellido", { min: 2, max: 50 }),
  dni: digitsField("El DNI", { exact: 8 }),
  email: z
    .string()
    .nonempty("El email es obligatorio")
    .email("Debe ser un email válido"),
  password: passwordField,
  birthDate: z
    .string()
    .nonempty("La fecha de nacimiento es obligatoria")
    .refine((val) => {
      const date = new Date(val)
      return !isNaN(date.getTime()) && date < new Date()
    }, {
      message: "Debe ser una fecha válida y en el pasado",
    }),
})

export type AdminCreateSchema = z.infer<typeof adminCreateSchema>

export const adminUpdateSchema = adminCreateSchema.omit({ password: true }).extend({
  status: z.boolean({
    required_error: "El estado del usuario es obligatorio",
  }),
})


export type AdminUpdateSchema = z.infer<typeof adminUpdateSchema>

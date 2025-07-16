import { z } from 'zod';
import { adultBirthDateField, digitsField, lettersField, passwordField, pastDateField } from '@/types/validation-rules'

/**
 * Validación para creación de administrador
 */
export const adminCreateSchema = z.object({
  firstName: lettersField("El nombre", { min: 3, max: 50 }),
  lastName: lettersField("El apellido", { min: 6, max: 50 }),
  dni: digitsField("El DNI", { exact: 8 }),
  email: z.string().nonempty("El correo es obligatorio").email("El correo electrónico no es válido"),
  password: passwordField,
  birthDate: adultBirthDateField("La fecha de nacimiento"),
});
export type AdminCreateRQ = z.infer<typeof adminCreateSchema>;

/**
 * Validación para actualizar administrador
 */
export const adminUpdateSchema = z.object({
  firstName: lettersField("El nombre", { min: 3, max: 50 }),
  lastName: lettersField("El apellido", { min: 6, max: 50 }),
  dni: digitsField("El DNI", { exact: 8 }),
  email: z.string().nonempty("El correo es obligatorio").email("El correo electrónico no es válido"),
  userStatus: z.boolean(),
  birthDate: pastDateField("La fecha de nacimiento"),
});
export type AdminUpdateRQ = z.infer<typeof adminUpdateSchema>;

export const adminProfileUpdateSchema = z.object({
  firstName: lettersField('El nombre', { min: 3, max: 50 }),
  lastName: lettersField('El apellido', { min: 3, max: 50 }),
  birthDate: pastDateField('La fecha de nacimiento'),
});

export type AdminProfileUpdateRQ = z.infer<typeof adminProfileUpdateSchema>;

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(8, "La contraseña actual es obligatoria"),
    newPassword: passwordField,
    confirmPassword: z.string().min(8, "Confirma tu nueva contraseña"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  });

export type ChangePasswordForm = z.infer<typeof changePasswordSchema>; 
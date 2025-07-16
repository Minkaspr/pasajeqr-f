import { z } from 'zod';

/**
 * Validación para nombre de paradero
 */
const stopNameField = z
  .string()
  .nonempty("El nombre del paradero es obligatorio")
  .min(2, "El nombre del paradero debe tener al menos 2 caracteres")
  .max(100, "El nombre del paradero no puede tener más de 100 caracteres");
/**
 * Validación para campo isTerminal
 */
const terminalField = z.boolean({
  required_error: "Debes indicar si es un terminal o no",
  invalid_type_error: "El valor debe ser verdadero o falso",
});


/**
 * Esquema de validación para crear un paradero
 */
export const stopCreateSchema = z.object({
  name: stopNameField,
  terminal: terminalField,
});
export type StopCreateRQ = z.infer<typeof stopCreateSchema>;

/**
 * Esquema de validación para actualizar un paradero
 */
export const stopUpdateSchema = z.object({
  name: stopNameField,
  terminal: terminalField,
});
export type StopUpdateRQ = z.infer<typeof stopUpdateSchema>;

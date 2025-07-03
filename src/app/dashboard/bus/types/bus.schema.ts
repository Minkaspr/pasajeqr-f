import { z } from "zod"
import { BusStatus } from "./bus"

/**
 * Campo: Placa
 */
const plateField = z
  .string({
    required_error: "La placa es obligatoria",
    invalid_type_error: "La placa debe ser una cadena de texto",
  })
  .trim()
  .min(1, "La placa es obligatoria")
  .max(10, "La placa no debe exceder los 10 caracteres")

/**
 * Campo: Modelo
 */
const modelField = z
  .string({
    required_error: "El modelo es obligatorio",
    invalid_type_error: "El modelo debe ser una cadena de texto",
  })
  .trim()
  .min(1, "El modelo es obligatorio")
  .max(50, "El modelo no debe exceder los 50 caracteres")

/**
 * Campo: Capacidad
 */
const capacityField = z
  .number({
    required_error: "La capacidad es obligatoria",
    invalid_type_error: "La capacidad debe ser un número",
  })
  .int("La capacidad debe ser un número entero")
  .min(1, "La capacidad debe ser al menos 1")

/**
 * Campo: Estado del bus
 */
export const busStatusEnum = z.nativeEnum(BusStatus, {
  required_error: "El estado del bus es obligatorio",
  invalid_type_error: "El estado del bus debe ser válido",
})

/**
 * Esquema para crear un bus
 */
export const busCreateSchema = z.object({
  plate: plateField,
  model: modelField,
  capacity: capacityField,
  status: busStatusEnum,
})

export type BusCreateRQ = z.infer<typeof busCreateSchema>

/**
 * Esquema para actualizar un bus
 */
export const busUpdateSchema = z.object({
  plate: plateField,
  model: modelField,
  capacity: capacityField,
  status: busStatusEnum,
})

export type BusUpdateRQ = z.infer<typeof busUpdateSchema>

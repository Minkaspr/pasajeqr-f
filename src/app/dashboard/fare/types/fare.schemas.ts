import { z } from "zod"

/**
 * Campo: ID de paradero
 */
const stopIdField = z
  .number({
    required_error: "El ID del paradero es obligatorio",
    invalid_type_error: "El ID debe ser un número",
  })
  .int("El ID debe ser un número entero")
  .positive("El ID debe ser mayor que 0")

/**
 * Campo: Precio
 */
const priceField = z
  .number({
    required_error: "El precio es obligatorio",
    invalid_type_error: "El precio debe ser un número",
  })
  .positive("El precio debe ser mayor que 0")
  .refine(
    (val) => /^\d{1,5}(\.\d{1,2})?$/.test(val.toString()),
    "El precio debe tener hasta 5 dígitos enteros y 2 decimales"
  )

  /**
 * Esquema para crear una tarifa
 */
export const fareCreateSchema = z.object({
  originStopId: stopIdField,
  destinationStopId: stopIdField,
  price: priceField,
})

export type FareCreateRQ = z.infer<typeof fareCreateSchema>

/**
 * Esquema para actualizar una tarifa
 */
export const fareUpdateSchema = z.object({
  originStopId: stopIdField,
  destinationStopId: stopIdField,
  price: priceField,
})

export type FareUpdateRQ = z.infer<typeof fareUpdateSchema>
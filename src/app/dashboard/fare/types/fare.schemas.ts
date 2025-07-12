import { z } from "zod"

/**
 * Campo: ID de paradero
 */
const stopIdField = z.preprocess(
  (val) => (val === "" || val === null ? undefined : val),
  z
    .number({
      required_error: "Debes seleccionar un paradero.",
      invalid_type_error: "Debes seleccionar un paradero.",
    })
    .int("El ID debe ser un número entero")
    .positive("Debes seleccionar un paradero.")
)


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
export const fareCreateSchema = z
  .object({
    originStopId: stopIdField,
    destinationStopId: stopIdField,
    price: priceField,
  })
  .refine((data) => data.originStopId !== data.destinationStopId, {
    path: ["destinationStopId"],
    message: "El paradero de destino no puede ser igual al de origen.",
  })

export type FareCreateRQ = z.infer<typeof fareCreateSchema>

/**
 * Esquema para actualizar una tarifa
 */
export const fareUpdateSchema = z
  .object({
    originStopId: stopIdField,
    destinationStopId: stopIdField,
    price: priceField,
  })
  .refine((data) => data.originStopId !== data.destinationStopId, {
    path: ["destinationStopId"],
    message: "El paradero de destino no puede ser igual al de origen.",
  })

export type FareUpdateRQ = z.infer<typeof fareUpdateSchema>
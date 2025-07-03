import { ServiceStatus } from "@/types/service-status"
import { z } from "zod"

/**
 * Campo: ID numérico (para bus, driver, stops)
 */
const idField = z
  .number({
    required_error: "Este campo es obligatorio",
    invalid_type_error: "Debe ser un número",
  })
  .int("Debe ser un número entero")
  .positive("Debe ser mayor que 0")

/**
 * Campo: Código del servicio
 */
const codeField = z
  .string({
    required_error: "El código del servicio es obligatorio",
    invalid_type_error: "Debe ser una cadena de texto",
  })
  .min(1, "El código del servicio es obligatorio")
  .max(20, "El código no puede tener más de 20 caracteres")

/**
 * Campo: Fecha (formato YYYY-MM-DD)
 */
const dateField = z
  .string({
    required_error: "La fecha es obligatoria",
    invalid_type_error: "Debe ser una cadena de texto con formato de fecha",
  })
  .refine(
    (val) => /^\d{4}-\d{2}-\d{2}$/.test(val),
    "Debe tener el formato YYYY-MM-DD"
  )

/**
 * Campo: Hora (formato HH:mm)
 */
const timeField = z
  .string({
    required_error: "La hora es obligatoria",
    invalid_type_error: "Debe ser una cadena de texto con formato de hora",
  })
  .refine(
    (val) => /^([01]\d|2[0-3]):[0-5]\d$/.test(val),
    "Debe tener el formato HH:mm"
  )

/**
 * Campo: Estado del servicio (string enum)
 */
const serviceStatusValues = Object.values(ServiceStatus) as [string, ...string[]]

export const serviceStatusEnum = z.enum(serviceStatusValues, {
  required_error: "El estado del servicio es obligatorio",
})

export const tripCreateSchema = z.object({
  code: codeField,
  busId: idField,
  driverId: idField,
  originStopId: idField,
  destinationStopId: idField,
  departureDate: dateField,
  departureTime: timeField,
  arrivalDate: dateField.optional(),
  arrivalTime: timeField.optional(),
  status: serviceStatusEnum,
})

export type TripCreateRQ = z.infer<typeof tripCreateSchema>

export const tripUpdateSchema = z.object({
  code: codeField,
  busId: idField,
  driverId: idField,
  originStopId: idField,
  destinationStopId: idField,
  departureDate: dateField,
  departureTime: timeField,
  arrivalDate: dateField.optional(),
  arrivalTime: timeField.optional(),
  status: serviceStatusEnum,
})

export type TripUpdateRQ = z.infer<typeof tripUpdateSchema>

import { ServiceStatus } from "@/types/service-status"
import { z } from "zod"

// Helpers
const createRequiredId = (fieldName: string) =>
  z.preprocess(
    (val) => {
      if (val === "" || val === null || val === undefined) return null
      if (typeof val === "string") {
        const num = Number.parseInt(val)
        return isNaN(num) ? null : num
      }
      return val
    },
    z
      .number({
        required_error: `${fieldName} es obligatorio`,
        invalid_type_error: `${fieldName} es obligatorio`,
      })
      .positive(`${fieldName} debe ser válido`),
  )

const createRequiredDate = (fieldName: string) =>
  z
    .string({
      required_error: `${fieldName} es obligatoria`,
      invalid_type_error: `${fieldName} es obligatoria`,
    })
    .min(1, `${fieldName} es obligatoria`)
    .regex(/^\d{4}-\d{2}-\d{2}$/, `${fieldName} debe tener formato válido`)

const createRequiredTime = (fieldName: string) =>
  z
    .string({
      required_error: `${fieldName} es obligatoria`,
      invalid_type_error: `${fieldName} es obligatoria`,
    })
    .min(1, `${fieldName} es obligatoria`)
    .regex(/^([01]\d|2[0-3]):[0-5]\d$/, `${fieldName} debe tener formato HH:mm`)

const createOptionalDate = (fieldName: string) =>
  z
    .string()
    .optional()
    .refine((val) => {
      if (!val || val === "") return true
      return /^\d{4}-\d{2}-\d{2}$/.test(val)
    }, `${fieldName} debe tener formato válido`)

const createOptionalTime = (fieldName: string) =>
  z
    .string()
    .optional()
    .refine((val) => {
      if (!val || val === "") return true
      return /^([01]\d|2[0-3]):[0-5]\d$/.test(val)
    }, `${fieldName} debe tener formato HH:mm`)

// 🔁 Validaciones personalizadas comunes
const validateTripRules = (data: TripBase, ctx: z.RefinementCtx) => {
  const now = new Date()
  const departure = new Date(`${data.departureDate}T${data.departureTime}`)

  if (departure < now) {
    ctx.addIssue({
      path: ["departureTime"],
      message: "La fecha y hora de salida no pueden ser en el pasado",
      code: z.ZodIssueCode.custom,
    })
  }

  if (data.arrivalDate && !data.arrivalTime) {
    ctx.addIssue({
      path: ["arrivalTime"],
      message: "Si ingresas fecha de llegada, la hora es obligatoria",
      code: z.ZodIssueCode.custom,
    })
  }

  if (data.arrivalTime && !data.arrivalDate) {
    ctx.addIssue({
      path: ["arrivalDate"],
      message: "Si ingresas hora de llegada, la fecha es obligatoria",
      code: z.ZodIssueCode.custom,
    })
  }

  if (data.arrivalDate && data.arrivalTime) {
    const arrival = new Date(`${data.arrivalDate}T${data.arrivalTime}`)
    if (arrival <= departure) {
      ctx.addIssue({
        path: ["arrivalTime"],
        message: "La llegada debe ser posterior a la salida",
        code: z.ZodIssueCode.custom,
      })
    }
  }
}

// 🧱 Schema base reutilizable
const tripBaseSchema = z.object({
  busId: createRequiredId("Bus"),
  driverId: createRequiredId("Conductor"),
  originStopId: createRequiredId("Paradero de origen"),
  destinationStopId: createRequiredId("Paradero de destino"),
  departureDate: createRequiredDate("Fecha de salida"),
  departureTime: createRequiredTime("Hora de salida"),
  arrivalDate: createOptionalDate("Fecha de llegada"),
  arrivalTime: createOptionalTime("Hora de llegada"),
  status: z.nativeEnum(ServiceStatus, {
    required_error: "Estado es obligatorio",
  }),
})

type TripBase = z.infer<typeof tripBaseSchema>

// 📦 Schema para creación
export const tripCreateSchema = tripBaseSchema.superRefine(validateTripRules)

// ✏️ Schema para actualización (agrega campo `code`)
export const tripUpdateSchema = tripBaseSchema
  .extend({
    code: z
      .string({
        required_error: "Código es obligatorio",
      })
      .min(1, "Código es obligatorio"),
  })
  .superRefine(validateTripRules)

// 🧾 Tipos exportados (como pediste)
export type TripCreateRQ = z.infer<typeof tripCreateSchema>
export type TripUpdateRQ = z.infer<typeof tripUpdateSchema>
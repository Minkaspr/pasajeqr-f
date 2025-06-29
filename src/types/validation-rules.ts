import { z } from "zod"

export const lettersField = (field: string, options?: { min?: number; max?: number }) => {
  const min = options?.min ?? 1
  const max = options?.max ?? 50

  return z
    .string()
    .nonempty(`${field} es obligatorio`)
    .min(min, `Debe tener al menos ${min} caracteres`)
    .max(max, `Máximo ${max} caracteres`)
    .refine((val) => !val.startsWith(" "), {
      message: `${field} no puede comenzar con un espacio`,
    })
    .refine((val) => !val.endsWith(" "), {
      message: `${field} no puede terminar con un espacio`,
    })
    .refine((val) => /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ\s]+$/.test(val), {
      message: `${field} solo puede contener letras`,
    })
}

export const digitsField = (field: string, options?: { exact?: number }) => {
  const exact = options?.exact ?? 8

  return z
    .string()
    .nonempty(`${field} es obligatorio`)
    .length(exact, `${field} debe tener exactamente ${exact} dígitos`)
    .refine((val) => /^\d+$/.test(val), {
      message: `${field} solo puede contener números`,
    })
}

export const passwordField = z
  .string()
  .nonempty("La contraseña es obligatoria")
  .min(8, "Debe tener al menos 8 caracteres")
  .superRefine((val, ctx) => {
    if (val.includes(" ")) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "No puede contener espacios" })
    }
    if (!/[a-z]/.test(val)) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Debe tener una minúscula" })
    }
    if (!/[A-Z]/.test(val)) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Debe tener una mayúscula" })
    }
    if (!/\d/.test(val)) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Debe tener un número" })
    }
    if (!/[@#\$%*_\-]/.test(val)) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Debe tener un símbolo: @ # $ % * _ -" })
    }
  })

// Fecha válida y en el pasado
export const pastDateField = (field: string) =>
  z.string()
    .nonempty(`${field} es obligatorio`)
    .refine((val) => {
      const date = new Date(val)
      return !isNaN(date.getTime())
    }, {
      message: `${field} debe ser una fecha válida`,
    })
    .refine((val) => {
      const date = new Date(val)
      return date < new Date()
    }, {
      message: `${field} debe estar en el pasado`,
    })

// Fecha válida y en el futuro
export const futureDateField = (field: string) =>
  z.string()
    .nonempty(`${field} es obligatorio`)
    .refine((val) => {
      const date = new Date(val)
      return !isNaN(date.getTime())
    }, {
      message: `${field} debe ser una fecha válida`,
    })
    .refine((val) => {
      const date = new Date(val)
      return date > new Date()
    }, {
      message: `${field} debe estar en el futuro`,
    })

// Fecha válida (pasado, presente o futuro)
export const validDateField = (field: string) =>
  z.string()
    .nonempty(`${field} es obligatorio`)
    .refine((val) => {
      const date = new Date(val)
      return !isNaN(date.getTime())
    }, {
      message: `${field} debe ser una fecha válida`,
    })

// Fecha válida en el pasado y mayor de edad (mínimo 18 años)
export const adultBirthDateField = (field: string) =>
  z.string()
    .nonempty(`${field} es obligatorio`)
    .refine((val) => {
      const date = new Date(val)
      return !isNaN(date.getTime())
    }, {
      message: `${field} debe ser una fecha válida`,
    })
    .refine((val) => {
      const date = new Date(val)
      return date < new Date()
    }, {
      message: `${field} debe estar en el pasado`,
    })
    .refine((val) => {
      const birthDate = new Date(val)
      const today = new Date()
      const age = today.getFullYear() - birthDate.getFullYear()
      const hasBirthdayPassed =
        today.getMonth() > birthDate.getMonth() ||
        (today.getMonth() === birthDate.getMonth() && today.getDate() >= birthDate.getDate())
      return age > 18 || (age === 18 && hasBirthdayPassed)
    }, {
      message: `${field} debe corresponder a una persona mayor de 18 años`,
    })
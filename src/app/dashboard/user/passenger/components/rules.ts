import { z } from "zod";

export const alphanumericField = (field: string, options?: { min?: number; max?: number }) => {
  const min = options?.min ?? 1;
  const max = options?.max ?? 100;

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
    .refine((val) => /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ\d\s]+$/.test(val), {
      message: `${field} solo puede contener letras y números`,
    });
};

export const alphanumericCodeField = (field: string, options?: { min?: number; max?: number }) => {
  const min = options?.min ?? 1;
  const max = options?.max ?? 100;

  return z
    .string()
    .nonempty(`${field} es obligatorio`)
    .min(min, `Debe tener al menos ${min} caracteres`)
    .max(max, `Máximo ${max} caracteres`)
    .refine((val) => !val.includes(" "), {
      message: `${field} no puede contener espacios`,
    })
    .refine((val) => /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ\d]+$/.test(val), {
      message: `${field} solo puede contener letras y números`,
    });
};


// ✔️ Validación completa: no vacío, sin espacios, solo letras
export const lettersField = (field: string, options?: { min?: number; max?: number }) => {
  const min = options?.min ?? 1;
  const max = options?.max ?? 50;

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
    });
};

export const digitsField = (field: string, options?: { min?: number; max?: number; exact?: number }) => {
  const min = options?.exact ?? options?.min ?? 1;
  const max = options?.exact ?? options?.max ?? 20;

  return z
    .string()
    .nonempty(`${field} es obligatorio`)
    .min(min, `Debe tener al menos ${min} caracteres`)
    .max(max, `Máximo ${max} caracteres`)
    .refine((val) => !val.includes(" "), {
      message: `${field} no puede contener espacios`,
    })
    .refine((val) => /^\d+$/.test(val), {
      message: `${field} solo puede contener números`,
    })
    .refine((val) => options?.exact ? val.length === options.exact : true, {
      message: `${field} debe tener exactamente ${options?.exact} dígitos`,
    });
};

// ✔️ Contraseña segura
export const passwordField = z
  .string()
  .nonempty("La contraseña es obligatoria")
  .min(8, "Debe tener al menos 8 caracteres")
  .superRefine((val, ctx) => {
    if (val.includes(" ")) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "La contraseña no puede contener espacios",
      });
    }

    if (!/^[A-Za-z\d@#\$%*_\-]+$/.test(val)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Solo letras, números y símbolos: @ # $ % * _ -",
      });
    }

    if (!/[a-z]/.test(val)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Debe tener al menos una letra minúscula",
      });
    }

    if (!/[A-Z]/.test(val)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Debe tener al menos una letra mayúscula",
      });
    }

    if (!/\d/.test(val)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Debe tener al menos un número",
      });
    }

    if (!/[@#\$%*_\-]/.test(val)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Debe tener al menos un símbolo: @ # $ % * _ -",
      });
    }
  });


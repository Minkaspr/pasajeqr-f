import { z } from 'zod';

export const bulkDeleteSchema = z.object({
  ids: z
    .array(z.number().min(1, 'El ID debe ser mayor a 0'))
    .min(1, 'Debes seleccionar al menos un administrador')
    .max(20, 'Solo puedes eliminar hasta 20 administradores a la vez'),
});
export type BulkDeleteRQ = z.infer<typeof bulkDeleteSchema>;

export interface BulkDeleteRS {
  deletedIds: number[];
  notFoundIds: number[];
}
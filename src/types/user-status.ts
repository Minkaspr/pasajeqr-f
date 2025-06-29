import { z } from 'zod';

export const userStatusSchema = z.object({
  active: z.boolean(),
});
export type UserStatusRQ = z.infer<typeof userStatusSchema>;

export interface UserStatusRS {
  userId: number;
  active: boolean;
}


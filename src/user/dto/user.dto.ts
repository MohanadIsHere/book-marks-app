import { UserRole } from '@prisma/client';
import z from 'zod';

export const UpdateUserSchema = z.object({
  // name String
  // email String @unique
  // password String
  name: z.string().trim().optional(),
  email: z.string().trim().email().toLowerCase().optional(),
  password: z.string().trim().optional(),
  role: z.enum(Object.values(UserRole), { message: 'Invalid role' }).optional(),
});
export type UpdateUserDto = z.infer<typeof UpdateUserSchema>;
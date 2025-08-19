import { UserRole } from '@prisma/client';
import { z } from 'zod';

export const RegisterSchema = z.object({
  name: z.string().trim().min(1, { message: 'Name is required' }),
  email: z
    .string()
    .trim()
    .email({ message: 'Invalid email' })
    .min(1, { message: 'Email is required' })
    .toLowerCase(),
  password: z.string().trim().min(1, { message: 'Password is required' }),
  role: z.enum(Object.values(UserRole), { message: 'Invalid role' }).optional(),
});
export const LoginSchema = z.object({
  email: z
    .string()
    .trim()
    .email({ message: 'Invalid email' })
    .min(1, { message: 'Email is required' })
    .toLowerCase(),
  password: z.string().trim().min(1, { message: 'Password is required' }),
});

export type RegisterDto = z.infer<typeof RegisterSchema>;
export type LoginDto = z.infer<typeof LoginSchema>;

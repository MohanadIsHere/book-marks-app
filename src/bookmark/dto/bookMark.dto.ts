import z from 'zod';

export const CreateBookmarkSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, { message: 'Title is required' }),
  description: z.string().trim().optional(),
});

export type CreateBookmarkDto = z.infer<typeof CreateBookmarkSchema>;

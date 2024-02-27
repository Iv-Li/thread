import { z } from 'zod'

export const ThreadValidation = z.object({
  thread: z.string().trim().min(3, { message: 'Required minimum 3 symbols' }),
  authorId: z.string()
})
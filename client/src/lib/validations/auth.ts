import { z } from 'zod'

export const loginSchema = z.object({
   email: z.string().min(1, 'Email is required').email('Invalid email address'),
   password: z.string().min(1, 'Password is required'),
})

export type LoginFormData = z.infer<typeof loginSchema>

export const registerSchema = z.object({
   name: z.string().min(1, 'Name is required').min(2, 'Name must be at least 2 characters'),
   email: z.string().min(1, 'Email is required').email('Invalid email address'),
   password: z
      .string()
      .min(1, 'Password is required')
      .min(8, 'Password must be at least 8 characters'),
   role: z.enum(['QA', 'DEV', 'PM', 'CLIENT'], {
      message: 'Please select a role',
   }),
})

export type RegisterFormData = z.infer<typeof registerSchema>

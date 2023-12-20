import {z} from 'zod'

export const AttendeeVerifier = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
  petName: z.string().min(1),
  petType: z.string().min(1),
})
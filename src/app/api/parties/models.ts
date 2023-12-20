import {z} from 'zod'

export const PartyVerifier = z.object(
  {
    name: z.string().min(1),
    date: z.coerce.date(),
    address: z.string().min(1),
    address2: z.string().optional(),
    city: z.string().min(1),
    state: z.string().min(2).max(2)
  }
)
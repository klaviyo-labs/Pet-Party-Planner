import {z} from "zod";
import {MIN_PASSWORD_LENGTH} from "@/app/api/schemas/User";

export const LoginCredentialVerifier = z.object({
  email: z.string().email(),
  password: z.string().min(MIN_PASSWORD_LENGTH)
})

export type LoginCredential = z.infer<typeof LoginCredentialVerifier>

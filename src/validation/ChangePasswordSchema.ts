import { z } from 'zod';

export const ChangePasswordSchema = z.object({
  oldPassword: z.string().min(6, "L'ancien mot de passe doit contenir au moins 6 caractères"),
  newPassword: z
    .string()
    .min(8, "Le nouveau mot de passe doit contenir au moins 8 caractères")
    .regex(/[A-Z]/, "Le mot de passe doit contenir une majuscule")
    .regex(/[0-9]/, "Le mot de passe doit contenir un chiffre"),
});

import { z } from "zod";

export const CredentialsSchema = z.object({
    email: z.string().email("Email invalide"),
    password: z.string()
        .min(8, "Le mot de passe doit contenir au moins 8 caractères")
        .regex(/[A-Z]/, "Le mot de passe doit contenir au moins une majuscule")
        .regex(/[0-9]/, "Le mot de passe doit contenir au moins un chiffre")
        .regex(/[^A-Za-z0-9]/, "Le mot de passe doit contenir au moins un caractère spécial")
});

export type Credentials = z.infer<typeof CredentialsSchema>;

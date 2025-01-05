import { z } from "zod";


export const loginSchema = z.object({
	email: z.string().email({ message: "Adresse email invalide" }),
	password: z.string().min(8, { message: "le mot de passe doit contenir au moins 8 caractères" }),
});

export type Login = z.infer<typeof loginSchema>;

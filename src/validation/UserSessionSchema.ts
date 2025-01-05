import { optional, z } from "zod";


export const UserSessionSchema = z.object({
    userId: z.number().int(), // L'ID de l'utilisateur doit être un entier
    token: z.string(), // Le token doit être une chaîne de caractères
    ipAddress: z.string().min(7).max(45), // Valide les adresses IP (IPv4 et IPv6)
    userAgent: z.string(), // Le user agent doit être une chaîne de caractères
    expiredAt: z.date(), // La date d'expiration doit être un objet Date
});

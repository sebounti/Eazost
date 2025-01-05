
import { optional, z } from "zod";


export const UsersInfoSchema = z.object({
	users_id: z.number().nonnegative(),  // Assurez-vous que users_id est bien validé comme un nombre
	first_name: z.string().min(1, { message: "le prénom est requis" }),
	last_name: z.string().min(1, { message: "le nom est requis" }),
	date_of_birth: z.string().refine(
		(val) => !isNaN(Date.parse(val)), // Vérifie si la date est valide
		{ message: "Invalid date format" }
	  ),	address_line1: z.string().min(1, { message: "l'adresse est requise" }),
	address_line2: z.string().optional(),
	city: z.string().min(1, { message: "la ville est requise" }),
	zipcode: z.string().min(1, { message: "le code postal est requis" }),
	country: z.string().min(1, { message: "le pays est requis" }),
	phone_number: z.string().regex(/^\+?\d{10,15}$/, { message: "Numéro de téléphone invalide" }),
	profile_image_url: z.string().url().optional(),
});

import { z } from "zod";

export const accommodationSchema = z.object({
  accommodation_id: z.number().optional(),  // OK - autoincrement
  uuid: z.string().uuid().optional(),  // OK - généré côté serveur
  users_id: z.string(),  // Changé en string pour correspondre au varchar
  type: z.string().min(1, "Le type est requis").max(255),
  name: z.string().min(1, "Le nom est requis").max(255),
  photo_url: z.string()
    .min(1, "L'URL de la photo est requise")
    .max(255)
    .transform(val => val.startsWith('http') ? val : `${process.env.NEXT_PUBLIC_BASE_URL}${val}`),
  address_line1: z.string().min(1, "L'adresse ligne 1 est requise").max(255),
  address_line2: z.string().max(255).optional(),
  city: z.string().min(1, "La ville est requise").max(50),
  zipcode: z.string().min(1, "Le code postal est requis").max(10),
  country: z.string().min(1, "Le pays est requis").max(40),
  description: z.string().max(1000).optional(),
  created_at: z.date().optional(),  // OK - géré par la DB
  updated_at: z.date().optional(),  // OK - géré par la DB
});

export type Accommodation = z.infer<typeof accommodationSchema>;

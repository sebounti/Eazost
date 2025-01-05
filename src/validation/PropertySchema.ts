import { z } from "zod";

export const accommodationSchema = z.object({
  accommodation_id: z.number().optional(),  // Peut être ignoré lors de la création
  uuid: z.string().uuid().optional(),  // Géré par la base de données
  users_id: z.number().nonnegative("L'ID de l'utilisateur est requis"),
  type: z.string().min(1, "Le type est requis").max(255),
  name: z.string().min(1, "Le nom est requis").max(255),
  photo_url: z.string().url("L'URL de la photo est requise"), // Ajout de la validation pour photo_url
  address_line1: z.string().min(1, "L'adresse ligne 1 est requise").max(255),
  address_line2: z.string().max(255).optional(),
  city: z.string().min(1, "La ville est requise").max(50),
  zipcode: z.string().min(1, "Le code postal est requis").max(10),
  country: z.string().min(1, "Le pays est requis").max(40),
  description: z.string().max(1000).optional(),
  created_at: z.date().optional(),
  updated_at: z.date().optional(),
});

export type Accommodation = z.infer<typeof accommodationSchema>;

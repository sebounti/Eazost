import { z } from "zod";

export const accommodationSchema = z.object({
  type: z.string().min(1, "Le type est requis"),
  name: z.string().min(1, "Le nom est requis"),
  address_line1: z.string().min(1, "L'adresse est requise"),
  address_line2: z.string().optional(),
  city: z.string().min(1, "La ville est requise"),
  zipcode: z.string().min(1, "Le code postal est requis"),
  country: z.string().min(1, "Le pays est requis"),
  description: z.string().min(1, "La description est requise"),
  photo_url: z.string().optional(),
  user_id: z.string().min(1, "L'identifiant utilisateur est requis")
});

export type AccommodationInput = z.infer<typeof accommodationSchema>;

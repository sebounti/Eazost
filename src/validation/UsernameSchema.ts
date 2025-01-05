import { z } from 'zod';

const UsernameSchema = z.object({
	first_name: z.string().optional(),
	last_name: z.string().optional(),
  }).passthrough();  // Accepte les champs supplémentaires sans validation

export const UsersInfoSchema = z.array(UsernameSchema); // Pour gérer une liste de données utilisateur

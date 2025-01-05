import { accommodation } from "@/db/appSchema";
import { int } from "drizzle-orm/mysql-core";
import { optional, z } from "zod";

// components props validation
export const CardSchema = z.object({
	id: z.number(),
	title: z.string(),
	category: z.string(),
	description: z.string(),
	status: z.enum(["Published", "Draft"]), // Limite les valeurs à deux options
	image: z.string().url(), // Valide que l'image est une URL valide
	date: z.string(),
	accommodation_id: z.number(),
  });

  export type Card = z.infer<typeof CardSchema>;

import { z } from "zod";

export const productSchema = z.object({
	product_id: z.number().min(1, "Le product_id est requis"),
	uuid: z.string().min(1, "Le uuid est requis"),
	name: z.string().min(1, "Le nom est requis"),
	description: z.string().min(1, "La description est requise"),
	price: z.number().min(1, "Le prix est requis"),
	stock: z.number().min(1, "Le stock est requis"),
  	shop_id: z.number().min(1, "Le shop_id est requis"),
});

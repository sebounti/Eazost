import { z } from "zod";

export const accommodationShopSchema = z.object({
	shop_id: z.number().min(1, "Le shop_id est requis"),
	uuid: z.string().min(1, "Le uuid est requis"),
	accommodation_id: z.number().min(1, "Le accommodation_id est requis"),
	name: z.string().min(1, "Le nom est requis"),
	created_at: z.date().optional(),
	updated_at: z.date().optional(),
});

export type AccommodationShopInput = z.infer<typeof accommodationShopSchema>;

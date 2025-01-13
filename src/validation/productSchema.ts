import { z } from 'zod';

export const productSchema = z.object({
	product_id: z.number(),
	uuid: z.string().uuid(),
	name: z.string().max(255),
	description: z.string().max(1000).nullable(),
	price: z.string(),
	image_url: z.string().nullable(),
	stock: z.number(),
	created_at: z.preprocess((arg) => new Date(arg as string), z.date()),
	updated_at: z.preprocess((arg) => new Date(arg as string), z.date()),
	shop_id: z.number(),
});

export type Product = z.infer<typeof productSchema>;

import { z } from 'zod';

export const shopSchema = z.object({
	shop_id: z.number(),
	name: z.string(),
	uuid: z.string(),
	accommodation_id: z.number(),
	created_at: z.date(),
	updated_at: z.date(),
});

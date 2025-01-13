import { z } from "zod";

export const stayInfoSchema = z.object({
	stayInfo_id: z.number(),
  accommodation_id: z.number(),
  title: z.string(),
  category: z.string(),
  description: z.string(),
  photo_url: z.string().url()
});

export type StayInfoInput = z.infer<typeof stayInfoSchema>;

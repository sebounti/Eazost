import { z } from "zod";

export const stayInfoSchema = z.object({
  user_id: z.string(),
  accommodation_id: z.number(),
  title: z.string(),
  category: z.string(),
  description: z.string(),
  photo_url: z.string().url()
});

export type StayInfoInput = z.infer<typeof stayInfoSchema>;

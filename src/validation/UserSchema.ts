// validationSchema.ts

import { z } from "zod";

export const usersSchema = z.object({
	id: z.string().optional(),
	user_name: z.string()
		.min(3, { message: 'The user name must be at least 3 characters long.' })
		.max(30, { message: 'The user name must not exceed 30 characters.' }),
	email: z.string().email({ message: 'Invalid email address.' }),
	password: z.string()
		.min(8, { message: 'The password must be at least 8 characters long.' })
		.max(32, { message: 'Password must not exceed 32 characters.' })
		.regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/,
			{ message: 'The password must contain at least one uppercase letter, one lowercase letter, one number and one special character.' }),
	account_type: z.enum(['owner', 'user'], { message: 'please select an account type' }),
	name: z.string().optional(),
	emailVerified: z.date().nullable().optional(),
	image: z.string().optional(),
	stripe_customer_id: z.string().optional(),
});

export type User = z.infer<typeof usersSchema>;

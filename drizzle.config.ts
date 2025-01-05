// Drizzle.config.ts
import 'dotenv/config';
import { Config } from "drizzle-kit";

export default {
	schema: ['./src/db/appSchema.ts', './src/db/authSchema.ts'],
	out: './drizzle/migrations',
	dialect: "mysql",
	dbCredentials: {
		url: "mysql://root:qwerty@127.0.0.1:3306/eazost",
	},
} satisfies Config;

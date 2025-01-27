import { mysqlTable, varchar, timestamp, int, boolean, decimal, date, text } from 'drizzle-orm/mysql-core';

// Table "Users"
export const users = mysqlTable('users', {
	id: varchar('id', { length: 255 }).primaryKey(),
	email: varchar('email', { length: 255 }).notNull().unique(),
	name: varchar('name', { length: 255 }),
	emailVerified: timestamp('emailVerified'),
	image: varchar('image', { length: 255 }),
	password: varchar('password', { length: 255 }).notNull(),
	uuid: varchar('uuid', { length: 36 }).notNull(),
	user_name: varchar('user_name', { length: 255 }).notNull(),
	account_type: varchar('account_type', { length: 50 }).notNull(),
	stripe_customer_id: varchar('stripe_customer_id', { length: 255 }),
	created_at: timestamp('created_at').defaultNow(),
	updated_at: timestamp('updated_at').defaultNow().onUpdateNow(),
});

export const accounts = mysqlTable('accounts', {
	id: varchar('id', { length: 255 }).primaryKey().notNull(),
	userId: varchar('userId', { length: 255 }).notNull(),
	type: varchar('type', { length: 255 }).notNull(),
	provider: varchar('provider', { length: 255 }).notNull(),
	providerAccountId: varchar('providerAccountId', { length: 255 }).notNull(),
	refresh_token: text('refresh_token'),
	access_token: text('access_token'),
	expires_at: int('expires_at'),
	token_type: varchar('token_type', { length: 255 }),
	scope: varchar('scope', { length: 255 }),
	id_token: text('id_token'),
	session_state: varchar('session_state', { length: 255 })
});


// Table "Users_session"
export const sessions = mysqlTable('sessions', {
	sessionToken: varchar('sessionToken', { length: 255 }).primaryKey(),
	userId: varchar('userId', { length: 255 }).notNull(),
	expires: timestamp('expires').notNull(),
});


// Table "Users_verification"
export const verificationTokens = mysqlTable('verification_tokens', {
	identifier: varchar('identifier', { length: 255 }).notNull(),
	token: varchar('token', { length: 255 }).notNull(),
	expires: timestamp('expires').notNull()
});

    // Table "Users_resetpassword"
export const usersResetPassword = mysqlTable('users_resetpassword', {
	reset_password_id: int('reset_password_id').primaryKey().autoincrement(),
	users_id: varchar('users_id', { length: 255 }).notNull().references(() => users.id),
	token: varchar('token', { length: 255 }).notNull(),
	created_at: timestamp('created_at').defaultNow(),
	updated_at: timestamp('updated_at').defaultNow().onUpdateNow(),
	used: boolean('used').default(false),
});

// Ajouter l'export de usersSession
export const usersSession = mysqlTable('users_session', {
	users_id: varchar('users_id', { length: 255 }).notNull(),
	token: varchar('token', { length: 255 }).notNull(),
	uuid: varchar('uuid', { length: 36 }).notNull(),
	expired_at: timestamp('expired_at').notNull(),
	user_agent: varchar('user_agent', { length: 255 }),
	ip_address: varchar('ip_address', { length: 45 })
});

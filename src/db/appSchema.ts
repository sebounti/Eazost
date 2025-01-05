import { mysqlTable, varchar, timestamp, int, boolean, decimal, date, text } from 'drizzle-orm/mysql-core';
import { users } from './authSchema';

// Table "Users_info"
export const usersInfo = mysqlTable('users_info', {
	users_info_id: int('users_info_id').primaryKey().autoincrement(),
	users_id: varchar('users_id', { length: 255 }).notNull().references(() => users.id),
	first_name: varchar('first_name', { length: 255 }).notNull(),
	last_name: varchar('last_name', { length: 255 }).notNull(),
	date_of_birth: date('date_of_birth'),
	address_line1: varchar('address_line1', { length: 255 }).notNull(),
	address_line2: varchar('address_line2', { length: 255 }),
	city: varchar('city', { length: 50 }).notNull(),
	zipcode: varchar('zipcode', { length: 10 }).notNull(),
	country: varchar('country', { length: 40 }).notNull(),
	phone_number: varchar('phone_number', { length: 40 }),
	photo_url: varchar('photo_url', { length: 255 }),
	created_at: timestamp('created_at').defaultNow(),
});


// Table "Accommodation"
export const accommodation = mysqlTable('accommodation', {
	accommodation_id: int('accommodation_id').primaryKey().autoincrement(),
	uuid: varchar('uuid', { length: 36 }).notNull(),
	users_id: varchar('users_id', { length: 255 }).notNull().references(() => users.id),
	type: varchar('type', { length: 255 }).notNull(),
	name: varchar('name', { length: 255 }).notNull(),
	address_line1: varchar('address_line1', { length: 255 }).notNull(),
	address_line2: varchar('address_line2', { length: 255 }),
	city: varchar('city', { length: 50 }).notNull(),
	zipcode: varchar('zipcode', { length: 10 }).notNull(),
	country: varchar('country', { length: 40 }).notNull(),
	description: varchar('description', { length: 1000 }),
	photo_url: varchar('photo_url', { length: 255 }),
	created_at: timestamp('created_at').defaultNow(),
	updated_at: timestamp('updated_at').defaultNow().onUpdateNow(),
});


// Table "Access_code"
export const accessCode = mysqlTable('access_code', {
	uuid: varchar('uuid', { length: 36 }).notNull(),
	access_code_id: int('access_code_id').primaryKey().autoincrement(),
	accommodation_id: int('accommodation_id').notNull().references(() => accommodation.accommodation_id),
	code: varchar('code', { length: 100 }).notNull(),
	expiration_date: timestamp('expiration_date'),
	created_at: timestamp('created_at').defaultNow(),
	updated_at: timestamp('updated_at').defaultNow().onUpdateNow(),
});


// Table "Shop"
export const shop = mysqlTable('shop', {
	shop_id: int('shop_id').primaryKey().autoincrement(),
	uuid: varchar('uuid', { length: 36 }).notNull(),
	accommodation_id: int('accommodation_id').notNull().references(() => accommodation.accommodation_id),
	name: varchar('name', { length: 255 }).notNull(),
	created_at: timestamp('created_at').defaultNow(),
	updated_at: timestamp('updated_at').defaultNow().onUpdateNow(),
});


// Table "Product"
export const product = mysqlTable('product', {
	product_id: int('product_id').primaryKey().autoincrement(),
	uuid: varchar('uuid', { length: 36 }).notNull(),
	name: varchar('name', { length: 255 }).notNull(),
	description: varchar('description', { length: 1000 }),
	price: decimal('price', { precision: 10, scale: 2 }).notNull(),
	image_url: varchar('image_url', { length: 255 }),
	stock: int('stock').notNull(),
	created_at: timestamp('created_at').defaultNow(),
	updated_at: timestamp('updated_at').defaultNow().onUpdateNow(),
	shop_id: int('shop_id').notNull().references(() => shop.shop_id),
});


// Table "Stay_info"
export const stayInfo = mysqlTable('stay_info', {
	stay_info_id: int('stay_info_id').primaryKey().autoincrement(),
	accommodation_id: int('accommodation_id').notNull().references(() => accommodation.accommodation_id),
	title: varchar('title', { length: 255 }).notNull(),
	description: varchar('description', { length: 1000 }).notNull(),
	photo_url: varchar('photo_url', { length: 255 }),
	category: varchar("category", { length: 255 }),
	created_at: timestamp('created_at').defaultNow(),
	updated_at: timestamp('updated_at').defaultNow().onUpdateNow(),
});


// Table "Orders"
export const orders = mysqlTable('orders', {
	order_id: int('order_id').primaryKey().autoincrement(),
	uuid: varchar('uuid', { length: 36 }).notNull(),
	users_id: varchar('users_id', { length: 255 }).notNull().references(() => users.id),
	status: varchar('status', { length: 50 }).notNull(),
	payment_status: varchar('payment_status', { length: 50 }).notNull(),
	amount: decimal('amount', { precision: 10, scale: 2 }).notNull(),
	created_at: timestamp('created_at').defaultNow(),
	updated_at: timestamp('updated_at').defaultNow().onUpdateNow(),
});


// Table "Order_Item"
export const orderItem = mysqlTable('order_item', {
	order_item_id: int('order_item_id').primaryKey().autoincrement(),
	uuid: varchar('uuid', { length: 36 }).notNull(),
	order_id: int('order_id').notNull().references(() => orders.order_id),
	product_id: int('product_id').notNull().references(() => product.product_id),
	quantity: int('quantity').notNull(),
	price: decimal('price', { precision: 10, scale: 2 }).notNull(),
});


// Table "Order_History"
export const orderHistory = mysqlTable('order_history', {
	history_id: int('history_id').primaryKey().autoincrement(),
	uuid: varchar('uuid', { length: 36 }).notNull(),
	order_id: int('order_id').notNull().references(() => orders.order_id),
	users_id: varchar('users_id', { length: 255 }).notNull().references(() => users.id),
	operation: varchar('operation', { length: 50 }).notNull(),
	amount: decimal('amount', { precision: 10, scale: 2 }).notNull(),
	operation_date: timestamp('operation_date').defaultNow(),
	created_at: timestamp('created_at').defaultNow(),
});


// Table "Messages"
export const messages = mysqlTable('messages', {
	message_id: int('message_id').primaryKey().autoincrement(),
	uuid: varchar('uuid', { length: 36 }).notNull(),
	sender_users_id: varchar('sender_users_id', { length: 255 }).notNull().references(() => users.id),
	receiver_users_id: varchar('receiver_users_id', { length: 255 }).notNull().references(() => users.id),
	comment: varchar('comment', { length: 1000 }).notNull(),
	read: boolean('read').default(false),
	created_at: timestamp('created_at').defaultNow(),
});


// Table "Payment"
export const payment = mysqlTable('payment', {
	payment_id: int('payment_id').primaryKey().autoincrement(),
	uuid: varchar('uuid', { length: 36 }).notNull(),
	order_id: int('order_id').notNull().references(() => orders.order_id),  // Référence à la table "Orders"
	stripe_payment_id: varchar('stripe_payment_id', { length: 50 }).notNull(),  // ID Stripe ou autre système de paiement
	amount: decimal('amount', { precision: 10, scale: 2 }).notNull(),  // Montant payé
	status: varchar('status', { length: 50 }).notNull(),  // Statut du paiement
	created_at: timestamp('created_at').defaultNow(),  // Date de création de l'enregistrement
	updated_at: timestamp('updated_at').defaultNow().onUpdateNow(),  // Date de mise à jour
});


// Table "Favorite"
export const favorite = mysqlTable('favorite', {
	favorite_id: int('favorite_id').primaryKey().autoincrement(),
	users_id: varchar('users_id', { length: 255 }).notNull().references(() => users.id),
	property_id: int('property_id').notNull().references(() => accommodation.accommodation_id),
	created_at: timestamp('created_at').defaultNow(),
});

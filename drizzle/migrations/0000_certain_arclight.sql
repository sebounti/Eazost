CREATE TABLE `access_code` (
	`uuid` varchar(36) NOT NULL,
	`access_code_id` int AUTO_INCREMENT NOT NULL,
	`accommodation_id` int NOT NULL,
	`code` varchar(100) NOT NULL,
	`expiration_date` timestamp,
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `access_code_access_code_id` PRIMARY KEY(`access_code_id`)
);
--> statement-breakpoint
CREATE TABLE `accommodation` (
	`accommodation_id` int AUTO_INCREMENT NOT NULL,
	`uuid` varchar(36) NOT NULL,
	`users_id` int NOT NULL,
	`type` varchar(255) NOT NULL,
	`name` varchar(255) NOT NULL,
	`address_line1` varchar(255) NOT NULL,
	`address_line2` varchar(255),
	`city` varchar(50) NOT NULL,
	`zipcode` varchar(10) NOT NULL,
	`country` varchar(40) NOT NULL,
	`description` varchar(1000),
	`photo_url` varchar(255),
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `accommodation_accommodation_id` PRIMARY KEY(`accommodation_id`)
);
--> statement-breakpoint
CREATE TABLE `favorite` (
	`favorite_id` int AUTO_INCREMENT NOT NULL,
	`users_id` int NOT NULL,
	`property_id` int NOT NULL,
	`created_at` timestamp DEFAULT (now()),
	CONSTRAINT `favorite_favorite_id` PRIMARY KEY(`favorite_id`)
);
--> statement-breakpoint
CREATE TABLE `messages` (
	`message_id` int AUTO_INCREMENT NOT NULL,
	`uuid` varchar(36) NOT NULL,
	`sender_users_id` int NOT NULL,
	`receiver_users_id` int NOT NULL,
	`comment` varchar(1000) NOT NULL,
	`read` boolean DEFAULT false,
	`created_at` timestamp DEFAULT (now()),
	CONSTRAINT `messages_message_id` PRIMARY KEY(`message_id`)
);
--> statement-breakpoint
CREATE TABLE `order_history` (
	`history_id` int AUTO_INCREMENT NOT NULL,
	`uuid` varchar(36) NOT NULL,
	`order_id` int NOT NULL,
	`users_id` int NOT NULL,
	`operation` varchar(50) NOT NULL,
	`amount` decimal(10,2) NOT NULL,
	`operation_date` timestamp DEFAULT (now()),
	`created_at` timestamp DEFAULT (now()),
	CONSTRAINT `order_history_history_id` PRIMARY KEY(`history_id`)
);
--> statement-breakpoint
CREATE TABLE `order_item` (
	`order_item_id` int AUTO_INCREMENT NOT NULL,
	`uuid` varchar(36) NOT NULL,
	`order_id` int NOT NULL,
	`product_id` int NOT NULL,
	`quantity` int NOT NULL,
	`price` decimal(10,2) NOT NULL,
	CONSTRAINT `order_item_order_item_id` PRIMARY KEY(`order_item_id`)
);
--> statement-breakpoint
CREATE TABLE `orders` (
	`order_id` int AUTO_INCREMENT NOT NULL,
	`uuid` varchar(36) NOT NULL,
	`users_id` int NOT NULL,
	`status` varchar(50) NOT NULL,
	`payment_status` varchar(50) NOT NULL,
	`amount` decimal(10,2) NOT NULL,
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `orders_order_id` PRIMARY KEY(`order_id`)
);
--> statement-breakpoint
CREATE TABLE `payment` (
	`payment_id` int AUTO_INCREMENT NOT NULL,
	`uuid` varchar(36) NOT NULL,
	`order_id` int NOT NULL,
	`stripe_payment_id` varchar(50) NOT NULL,
	`amount` decimal(10,2) NOT NULL,
	`status` varchar(50) NOT NULL,
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `payment_payment_id` PRIMARY KEY(`payment_id`)
);
--> statement-breakpoint
CREATE TABLE `product` (
	`product_id` int AUTO_INCREMENT NOT NULL,
	`uuid` varchar(36) NOT NULL,
	`name` varchar(255) NOT NULL,
	`description` varchar(1000),
	`price` decimal(10,2) NOT NULL,
	`image_url` varchar(255),
	`stock` int NOT NULL,
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`shop_id` int NOT NULL,
	CONSTRAINT `product_product_id` PRIMARY KEY(`product_id`)
);
--> statement-breakpoint
CREATE TABLE `shop` (
	`shop_id` int AUTO_INCREMENT NOT NULL,
	`uuid` varchar(36) NOT NULL,
	`accommodation_id` int NOT NULL,
	`name` varchar(255) NOT NULL,
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `shop_shop_id` PRIMARY KEY(`shop_id`)
);
--> statement-breakpoint
CREATE TABLE `stay_info` (
	`stay_info_id` int AUTO_INCREMENT NOT NULL,
	`accommodation_id` int NOT NULL,
	`title` varchar(255) NOT NULL,
	`description` varchar(1000) NOT NULL,
	`photo_url` varchar(255),
	`category` varchar(255),
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `stay_info_stay_info_id` PRIMARY KEY(`stay_info_id`)
);
--> statement-breakpoint
CREATE TABLE `users_info` (
	`users_info_id` int NOT NULL,
	`users_id` int NOT NULL,
	`first_name` varchar(255) NOT NULL,
	`last_name` varchar(255) NOT NULL,
	`date_of_birth` date,
	`address_line1` varchar(255) NOT NULL,
	`address_line2` varchar(255),
	`city` varchar(50) NOT NULL,
	`zipcode` varchar(10) NOT NULL,
	`country` varchar(40) NOT NULL,
	`phone_number` varchar(40),
	`photo_url` varchar(255),
	`created_at` timestamp DEFAULT (now()),
	CONSTRAINT `users_info_users_info_id` PRIMARY KEY(`users_info_id`)
);
--> statement-breakpoint
ALTER TABLE `access_code` ADD CONSTRAINT `access_code_accommodation_id_accommodation_accommodation_id_fk` FOREIGN KEY (`accommodation_id`) REFERENCES `accommodation`(`accommodation_id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `accommodation` ADD CONSTRAINT `accommodation_users_id_users_id_fk` FOREIGN KEY (`users_id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `favorite` ADD CONSTRAINT `favorite_users_id_users_id_fk` FOREIGN KEY (`users_id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `favorite` ADD CONSTRAINT `favorite_property_id_accommodation_accommodation_id_fk` FOREIGN KEY (`property_id`) REFERENCES `accommodation`(`accommodation_id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `messages` ADD CONSTRAINT `messages_sender_users_id_users_id_fk` FOREIGN KEY (`sender_users_id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `messages` ADD CONSTRAINT `messages_receiver_users_id_users_id_fk` FOREIGN KEY (`receiver_users_id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `order_history` ADD CONSTRAINT `order_history_order_id_orders_order_id_fk` FOREIGN KEY (`order_id`) REFERENCES `orders`(`order_id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `order_history` ADD CONSTRAINT `order_history_users_id_users_id_fk` FOREIGN KEY (`users_id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `order_item` ADD CONSTRAINT `order_item_order_id_orders_order_id_fk` FOREIGN KEY (`order_id`) REFERENCES `orders`(`order_id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `order_item` ADD CONSTRAINT `order_item_product_id_product_product_id_fk` FOREIGN KEY (`product_id`) REFERENCES `product`(`product_id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `orders` ADD CONSTRAINT `orders_users_id_users_id_fk` FOREIGN KEY (`users_id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `payment` ADD CONSTRAINT `payment_order_id_orders_order_id_fk` FOREIGN KEY (`order_id`) REFERENCES `orders`(`order_id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `product` ADD CONSTRAINT `product_shop_id_shop_shop_id_fk` FOREIGN KEY (`shop_id`) REFERENCES `shop`(`shop_id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `shop` ADD CONSTRAINT `shop_accommodation_id_accommodation_accommodation_id_fk` FOREIGN KEY (`accommodation_id`) REFERENCES `accommodation`(`accommodation_id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `stay_info` ADD CONSTRAINT `stay_info_accommodation_id_accommodation_accommodation_id_fk` FOREIGN KEY (`accommodation_id`) REFERENCES `accommodation`(`accommodation_id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `users_info` ADD CONSTRAINT `users_info_users_id_users_id_fk` FOREIGN KEY (`users_id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;
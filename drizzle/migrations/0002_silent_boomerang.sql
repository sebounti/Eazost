CREATE TABLE `accounts` (
	`id` varchar(255) NOT NULL,
	`userId` varchar(255) NOT NULL,
	`type` varchar(255) NOT NULL,
	`provider` varchar(255) NOT NULL,
	`providerAccountId` varchar(255) NOT NULL,
	`refresh_token` text,
	`access_token` text,
	`expires_at` int,
	`token_type` varchar(255),
	`scope` varchar(255),
	`id_token` text,
	`session_state` varchar(255),
	CONSTRAINT `accounts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `sessions` (
	`sessionToken` varchar(255) NOT NULL,
	`userId` varchar(255) NOT NULL,
	`expires` timestamp NOT NULL,
	CONSTRAINT `sessions_sessionToken` PRIMARY KEY(`sessionToken`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` varchar(255) NOT NULL,
	`email` varchar(255) NOT NULL,
	`name` varchar(255),
	`emailVerified` timestamp,
	`image` varchar(255),
	`password` varchar(255) NOT NULL,
	`uuid` varchar(36) NOT NULL,
	`user_name` varchar(255) NOT NULL,
	`account_type` varchar(50) NOT NULL,
	`stripe_customer_id` varchar(255),
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_email_unique` UNIQUE(`email`)
);
--> statement-breakpoint
CREATE TABLE `users_resetpassword` (
	`reset_password_id` int AUTO_INCREMENT NOT NULL,
	`users_id` int NOT NULL,
	`token` varchar(255) NOT NULL,
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`used` boolean DEFAULT false,
	CONSTRAINT `users_resetpassword_reset_password_id` PRIMARY KEY(`reset_password_id`)
);
--> statement-breakpoint
CREATE TABLE `usersVerification` (
	`identifier` varchar(255) NOT NULL,
	`token` varchar(255) NOT NULL,
	`expires` timestamp NOT NULL
);
--> statement-breakpoint
ALTER TABLE `users_info` MODIFY COLUMN `users_info_id` int AUTO_INCREMENT NOT NULL;--> statement-breakpoint
ALTER TABLE `users_resetpassword` ADD CONSTRAINT `users_resetpassword_users_id_users_id_fk` FOREIGN KEY (`users_id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;
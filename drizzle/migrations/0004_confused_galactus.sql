CREATE TABLE `users_session` (
	`users_id` varchar(255) NOT NULL,
	`token` varchar(255) NOT NULL,
	`uuid` varchar(36) NOT NULL,
	`expired_at` timestamp NOT NULL,
	`user_agent` varchar(255),
	`ip_address` varchar(45)
);
--> statement-breakpoint
ALTER TABLE `stay_info` DROP FOREIGN KEY `stay_info_accommodation_id_accommodation_accommodation_id_fk`;
--> statement-breakpoint
ALTER TABLE `stay_info` MODIFY COLUMN `description` text NOT NULL;--> statement-breakpoint
ALTER TABLE `stay_info` MODIFY COLUMN `category` varchar(100);--> statement-breakpoint
ALTER TABLE `stay_info` MODIFY COLUMN `created_at` timestamp NOT NULL DEFAULT (now());--> statement-breakpoint
ALTER TABLE `stay_info` MODIFY COLUMN `updated_at` timestamp NOT NULL DEFAULT (now());--> statement-breakpoint
ALTER TABLE `usersVerification` ADD `email` varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE `usersVerification` ADD `verified_at` timestamp;--> statement-breakpoint
ALTER TABLE `usersVerification` ADD `verification_token` varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE `usersVerification` DROP COLUMN `identifier`;--> statement-breakpoint
ALTER TABLE `usersVerification` DROP COLUMN `token`;--> statement-breakpoint
ALTER TABLE `usersVerification` DROP COLUMN `expires`;
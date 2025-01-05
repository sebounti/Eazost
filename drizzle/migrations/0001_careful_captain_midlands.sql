ALTER TABLE `accommodation` MODIFY COLUMN `users_id` varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE `favorite` MODIFY COLUMN `users_id` varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE `messages` MODIFY COLUMN `sender_users_id` varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE `messages` MODIFY COLUMN `receiver_users_id` varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE `order_history` MODIFY COLUMN `users_id` varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE `orders` MODIFY COLUMN `users_id` varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE `users_info` MODIFY COLUMN `users_id` varchar(255) NOT NULL;
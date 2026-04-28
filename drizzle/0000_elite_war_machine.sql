CREATE TABLE `employees` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`name` varchar(255),
	`age` int,
	`dOB` date,
	`desc` text,
	`gender` varchar(255),
	`skills` varchar(255),
	`city` varchar(255),
	`active` boolean DEFAULT false,
	CONSTRAINT `employees_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `products` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`name` varchar(255),
	`price` int,
	`category` varchar(255),
	`description` text,
	`launchDate` date,
	`tags` json,
	`inStock` boolean DEFAULT false,
	CONSTRAINT `products_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `qa_notes` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`que` text NOT NULL,
	`ans` text NOT NULL,
	`date` varchar(10) NOT NULL,
	`topic` varchar(16) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `qa_notes_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `subtopics` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`name` varchar(32) NOT NULL,
	`topic_id` bigint unsigned NOT NULL,
	CONSTRAINT `subtopics_id` PRIMARY KEY(`id`),
	CONSTRAINT `subtopics_name_unique` UNIQUE(`name`)
);
--> statement-breakpoint
CREATE TABLE `topics` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`name` varchar(16),
	CONSTRAINT `topics_id` PRIMARY KEY(`id`),
	CONSTRAINT `topics_name_unique` UNIQUE(`name`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`name` varchar(100) NOT NULL,
	`username` varchar(50) NOT NULL,
	`email` varchar(255) NOT NULL,
	`dob` date,
	`gender` enum('Male','Female','Other'),
	`role` enum('guest','user','admin') DEFAULT 'guest',
	`skills` json,
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_username_unique` UNIQUE(`username`),
	CONSTRAINT `users_email_unique` UNIQUE(`email`)
);
--> statement-breakpoint
ALTER TABLE `subtopics` ADD CONSTRAINT `subtopics_topic_id_topics_id_fk` FOREIGN KEY (`topic_id`) REFERENCES `topics`(`id`) ON DELETE no action ON UPDATE no action;
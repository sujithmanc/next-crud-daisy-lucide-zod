CREATE TABLE `document_contents` (
	`node_id` bigint NOT NULL,
	`content` text NOT NULL,
	`word_count` int DEFAULT 0,
	`status` enum('draft','published','archived') DEFAULT 'draft',
	CONSTRAINT `document_contents_node_id` PRIMARY KEY(`node_id`)
);
--> statement-breakpoint
CREATE TABLE `document_tags` (
	`node_id` bigint NOT NULL,
	`tag_id` bigint NOT NULL,
	CONSTRAINT `document_tags_node_id_tag_id_pk` PRIMARY KEY(`node_id`,`tag_id`)
);
--> statement-breakpoint
CREATE TABLE `nodes` (
	`id` bigint AUTO_INCREMENT NOT NULL,
	`parent_id` bigint,
	`user_id` bigint NOT NULL,
	`name` varchar(255) NOT NULL,
	`type` enum('folder','document') NOT NULL,
	`deleted_at` timestamp,
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `nodes_id` PRIMARY KEY(`id`),
	CONSTRAINT `uk_name_in_folder` UNIQUE(`parent_id`,`name`)
);
--> statement-breakpoint
CREATE TABLE `tags` (
	`id` bigint AUTO_INCREMENT NOT NULL,
	`name` varchar(50) NOT NULL,
	`created_at` timestamp DEFAULT (now()),
	CONSTRAINT `tags_id` PRIMARY KEY(`id`),
	CONSTRAINT `tags_name_unique` UNIQUE(`name`)
);
--> statement-breakpoint
ALTER TABLE `document_contents` ADD CONSTRAINT `document_contents_node_id_nodes_id_fk` FOREIGN KEY (`node_id`) REFERENCES `nodes`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `document_tags` ADD CONSTRAINT `document_tags_node_id_nodes_id_fk` FOREIGN KEY (`node_id`) REFERENCES `nodes`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `document_tags` ADD CONSTRAINT `document_tags_tag_id_tags_id_fk` FOREIGN KEY (`tag_id`) REFERENCES `tags`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `nodes` ADD CONSTRAINT `nodes_parent_id_nodes_id_fk` FOREIGN KEY (`parent_id`) REFERENCES `nodes`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `nodes` ADD CONSTRAINT `nodes_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `idx_user_nodes` ON `nodes` (`user_id`,`deleted_at`);
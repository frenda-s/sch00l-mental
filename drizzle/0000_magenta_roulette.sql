CREATE TABLE `appointments` (
	`id` text PRIMARY KEY NOT NULL,
	`student_id` text,
	`student_name` text NOT NULL,
	`contact_info` text NOT NULL,
	`counselor_id` text,
	`appointment_date` text NOT NULL,
	`time_slot` text NOT NULL,
	`format` text NOT NULL,
	`status` text NOT NULL,
	`note` text,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `counseling_letters` (
	`id` text PRIMARY KEY NOT NULL,
	`tracking_code` text NOT NULL,
	`student_id` text,
	`student_alias` text,
	`title` text NOT NULL,
	`content` text NOT NULL,
	`category` text NOT NULL,
	`status` text NOT NULL,
	`reply_content` text,
	`replied_by` text,
	`replied_at` integer,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `counseling_letters_tracking_code_unique` ON `counseling_letters` (`tracking_code`);--> statement-breakpoint
CREATE TABLE `mental_resources` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`slug` text NOT NULL,
	`category` text NOT NULL,
	`summary` text NOT NULL,
	`content_markdown` text NOT NULL,
	`icon_name` text NOT NULL,
	`is_published` integer NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `mental_resources_slug_unique` ON `mental_resources` (`slug`);--> statement-breakpoint
CREATE TABLE `screening_results` (
	`id` text PRIMARY KEY NOT NULL,
	`screening_id` text NOT NULL,
	`topic` text NOT NULL,
	`score` integer NOT NULL,
	`severity` text NOT NULL,
	`is_high_risk` integer NOT NULL,
	`answers_json` text NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `screenings` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text,
	`guest_session_id` text,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`username` text NOT NULL,
	`password_hash` text NOT NULL,
	`full_name` text NOT NULL,
	`role` text NOT NULL,
	`grade` integer,
	`class_name` text,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_username_unique` ON `users` (`username`);
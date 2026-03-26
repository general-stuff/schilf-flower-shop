CREATE TABLE `orders` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`customer_name` text NOT NULL,
	`order_date` text NOT NULL,
	`flower_name` text NOT NULL,
	`size` text NOT NULL,
	`color` text NOT NULL
);

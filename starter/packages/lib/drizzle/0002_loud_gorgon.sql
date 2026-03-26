CREATE TABLE `flower_embeddings` (
	`id` integer PRIMARY KEY NOT NULL,
	`description_hash` text NOT NULL,
	`description_vector` blob NOT NULL
);

import { blob, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const flowers = sqliteTable("flowers", {
	id: integer().primaryKey({ autoIncrement: true }),
	name: text().notNull(),
	description: text().notNull(),
	colors: text().notNull(),
});

export const flowerEmbeddings = sqliteTable("flower_embeddings", {
	id: integer().primaryKey(),
	descriptionHash: text("description_hash").notNull(),
	descriptionVector: blob("description_vector", { mode: "buffer" }).notNull(),
});

export const orders = sqliteTable("orders", {
	id: integer().primaryKey({ autoIncrement: true }),
	customerName: text("customer_name").notNull(),
	orderDate: text("order_date").notNull(),
	flowerName: text("flower_name").notNull(),
	size: text().notNull(),
	color: text().notNull(),
});

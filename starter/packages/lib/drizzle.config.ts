import { defineConfig } from "drizzle-kit";

export default defineConfig({
	out: "./drizzle",
	schema: "./src/db/schema.ts",
	dialect: "sqlite",
	dbCredentials: {
		url: `${process.env.DB_FOLDER ?? "../../data"}/${process.env.DB_NAME ?? "flower_shop.db"}`,
	},
});

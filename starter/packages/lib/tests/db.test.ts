import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import { migrate } from "drizzle-orm/better-sqlite3/migrator";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import {
	addOrder,
	fillFlowers,
	getDbStatus,
	listFlowers,
	listOrders,
} from "../src/db/data-access.ts";
import * as schema from "../src/db/schema.ts";

describe("data access layer", () => {
	let db: ReturnType<typeof drizzle>;
	let sqlite: InstanceType<typeof Database>;

	beforeEach(() => {
		sqlite = new Database(":memory:");
		db = drizzle({ client: sqlite, schema });
		migrate(db, { migrationsFolder: "./packages/lib/drizzle" });
	});

	afterEach(() => {
		sqlite.close();
	});

	it("getDbStatus returns 42", async () => {
		const result = await getDbStatus(db);
		expect(result).toBe(42);
	});

	it("fillFlowers inserts 10 flowers", async () => {
		await fillFlowers(db);
		const result = await listFlowers(db);
		expect(result).toHaveLength(10);
	});

	it("fillFlowers clears existing data before inserting", async () => {
		await fillFlowers(db);
		await fillFlowers(db);
		const result = await listFlowers(db);
		expect(result).toHaveLength(10);
	});

	it("listFlowers returns all flower data", async () => {
		await fillFlowers(db);
		const result = await listFlowers(db);

		const names = result.map((f: { name: string }) => f.name);
		expect(names).toContain("Rose");
		expect(names).toContain("Lily");
		expect(names).toContain("Tulip");
		expect(names).toContain("Daisy");
		expect(names).toContain("Sunflower");
		expect(names).toContain("Orchid");
		expect(names).toContain("Poppy");
		expect(names).toContain("Aetherbell");
		expect(names).toContain("Emberveil");
		expect(names).toContain("Mirelume");
	});

	it("flowers have required fields", async () => {
		await fillFlowers(db);
		const result = await listFlowers(db);

		for (const flower of result) {
			expect(flower.id).toBeDefined();
			expect(flower.name).toBeTruthy();
			expect(flower.description).toBeTruthy();
			expect(flower.colors).toBeTruthy();
		}
	});
});

describe("orders", () => {
	let db: ReturnType<typeof drizzle>;
	let sqlite: InstanceType<typeof Database>;

	beforeEach(() => {
		sqlite = new Database(":memory:");
		db = drizzle({ client: sqlite, schema });
		migrate(db, { migrationsFolder: "./packages/lib/drizzle" });
	});

	afterEach(() => {
		sqlite.close();
	});

	it("addOrder inserts and returns the order with generated id and date", async () => {
		const order = await addOrder(db, {
			customerName: "Alice",
			flowerName: "Rose",
			size: "M",
			color: "red",
		});

		expect(order.id).toBeDefined();
		expect(order.customerName).toBe("Alice");
		expect(order.flowerName).toBe("Rose");
		expect(order.size).toBe("M");
		expect(order.color).toBe("red");
		expect(order.orderDate).toBeTruthy();
	});

	it("listOrders returns orders", async () => {
		await addOrder(db, {
			customerName: "Alice",
			flowerName: "Rose",
			size: "S",
			color: "red",
		});
		await addOrder(db, {
			customerName: "Bob",
			flowerName: "Lily",
			size: "L",
			color: "white",
		});

		const result = await listOrders(db);
		expect(result).toHaveLength(2);
		const names = result.map((o) => o.customerName);
		expect(names).toContain("Alice");
		expect(names).toContain("Bob");
	});

	it("listOrders respects skip and top", async () => {
		for (let i = 0; i < 5; i++) {
			await addOrder(db, {
				customerName: `Customer ${i}`,
				flowerName: "Rose",
				size: "M",
				color: "red",
			});
		}

		const result = await listOrders(db, { skip: 1, top: 2 });
		expect(result).toHaveLength(2);
	});

	it("listOrders defaults to skip 0 top 10", async () => {
		for (let i = 0; i < 15; i++) {
			await addOrder(db, {
				customerName: `Customer ${i}`,
				flowerName: "Rose",
				size: "M",
				color: "red",
			});
		}

		const result = await listOrders(db);
		expect(result).toHaveLength(10);
	});
});

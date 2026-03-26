import {
	addOrder,
	addOrderInputSchema,
	fillFlowers,
	getDb,
	getDbStatus,
	listFlowers,
	listOrders,
} from "@flower-shop/lib";
import { Command } from "commander";

const program = new Command();

program.name("flower-shop").description("Flower Shop CLI").version("0.1.0");

program
	.command("ping")
	.description("Check database connectivity")
	.action(async () => {
		const db = getDb();
		const result = await getDbStatus(db);
		console.log(`DB status: ${result}`);
	});

program
	.command("fill")
	.description("Fill the database with demo flower data")
	.action(async () => {
		const db = getDb();
		await fillFlowers(db);
		console.log("Demo data inserted successfully.");
	});

program
	.command("list")
	.description("List all flowers in the database")
	.action(async () => {
		const db = getDb();
		const result = await listFlowers(db);
		console.log(JSON.stringify(result, null, 2));
	});

program
	.command("list-orders")
	.description("List the most recent orders")
	.action(async () => {
		const db = getDb();
		const result = await listOrders(db);
		console.log(JSON.stringify(result, null, 2));
	});

program
	.command("add-order")
	.description("Add an order. Pass order data as JSON via STDIN.")
	.action(async () => {
		const chunks: Buffer[] = [];
		for await (const chunk of process.stdin) {
			chunks.push(chunk as Buffer);
		}
		const raw = Buffer.concat(chunks).toString("utf-8");
		const parsed = addOrderInputSchema.parse(JSON.parse(raw));
		const db = getDb();
		const order = await addOrder(db, parsed);
		console.log(JSON.stringify(order, null, 2));
	});

program.parse();

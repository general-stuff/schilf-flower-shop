import {
	addOrder,
	addOrderInputSchema,
	fillFlowers,
	getDb,
	getDbStatus,
	listFlowers,
	listOrders,
} from "@flower-shop/lib";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { Command } from "commander";
import { z } from "zod";

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

program
	.command("mcp")
	.description("Start an MCP server (stdio transport)")
	.action(async () => {
		const db = getDb();

		const server = new McpServer({
			name: "flower-shop",
			version: "0.1.0",
		});

		server.tool(
			"list-orders",
			"List the most recent orders from the flower shop",
			{
				skip: z
					.number()
					.int()
					.min(0)
					.optional()
					.describe("Number of orders to skip"),
				top: z
					.number()
					.int()
					.min(1)
					.max(100)
					.optional()
					.describe("Maximum number of orders to return (default 10)"),
			},
			async ({ skip, top }) => {
				const orders = await listOrders(db, { skip, top });
				return {
					content: [{ type: "text", text: JSON.stringify(orders, null, 2) }],
				};
			},
		);

		server.tool(
			"place-order",
			"Place a new flower order",
			{
				customerName: z.string().min(1).describe("Name of the customer"),
				flowerName: z
					.string()
					.min(1)
					.describe("Name of the dominant flower in the bouquet"),
				size: z
					.enum(["S", "M", "L"])
					.describe("Size of the bouquet: S, M, or L"),
				color: z.string().min(1).describe("Color of the bouquet"),
			},
			async ({ customerName, flowerName, size, color }) => {
				const order = await addOrder(db, {
					customerName,
					flowerName,
					size,
					color,
				});
				return {
					content: [{ type: "text", text: JSON.stringify(order, null, 2) }],
				};
			},
		);

		const transport = new StdioServerTransport();
		await server.connect(transport);
	});

program.parse();

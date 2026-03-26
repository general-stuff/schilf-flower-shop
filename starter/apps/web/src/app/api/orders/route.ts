import { getDb, listOrders } from "@flower-shop/lib";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
	const url = new URL(req.url);
	const skip = Number(url.searchParams.get("skip") ?? "0");
	const top = Number(url.searchParams.get("top") ?? "10");

	const db = getDb();
	const orders = await listOrders(db, { skip, top });
	return NextResponse.json(orders);
}

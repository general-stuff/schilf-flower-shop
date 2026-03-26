import { getDb, listOrders } from "@flower-shop/lib";
import OrdersList from "./OrdersList";

export const dynamic = "force-dynamic";

export default async function OrdersPage() {
	const db = getDb();
	const initialOrders = await listOrders(db, { skip: 0, top: 10 });
	return <OrdersList initialOrders={initialOrders} />;
}

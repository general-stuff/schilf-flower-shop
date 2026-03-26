"use client";

import type { Order } from "@flower-shop/lib";
import { useCallback, useState } from "react";
import "./orders.css";

interface OrdersListProps {
	initialOrders: Order[];
}

const PAGE_SIZE = 10;

export default function OrdersList({ initialOrders }: OrdersListProps) {
	const [orders, setOrders] = useState<Order[]>(initialOrders);
	const [page, setPage] = useState(0);
	const [loading, setLoading] = useState(false);

	const fetchPage = useCallback(async (newPage: number) => {
		setLoading(true);
		try {
			const res = await fetch(
				`/api/orders?skip=${newPage * PAGE_SIZE}&top=${PAGE_SIZE}`,
			);
			const data = (await res.json()) as Order[];
			setOrders(data);
			setPage(newPage);
		} finally {
			setLoading(false);
		}
	}, []);

	return (
		<div className="orders-container">
			<h1 className="orders-title">Orders</h1>
			{orders.length === 0 ? (
				<p className="orders-empty">No orders found.</p>
			) : (
				<div className="orders-grid" data-testid="orders-list">
					<div className="orders-grid__header">
						<span>Date</span>
						<span>Customer</span>
						<span>Flower</span>
						<span>Size</span>
					</div>
					{orders.map((order) => (
						<div
							key={order.id}
							className="orders-grid__row"
							data-testid="order-row"
						>
							<span>{new Date(order.orderDate).toLocaleString()}</span>
							<span data-testid="order-customer">{order.customerName}</span>
							<span data-testid="order-flower">{order.flowerName}</span>
							<span>{order.size}</span>
						</div>
					))}
				</div>
			)}
			<div className="orders-pagination">
				<button
					type="button"
					disabled={page === 0 || loading}
					onClick={() => fetchPage(page - 1)}
				>
					Previous
				</button>
				<span>Page {page + 1}</span>
				<button
					type="button"
					disabled={orders.length < PAGE_SIZE || loading}
					onClick={() => fetchPage(page + 1)}
				>
					Next
				</button>
			</div>
		</div>
	);
}

"use client";

import { Typography } from "@mui/material";
import { useEffect, useState } from "react";

export default function SessionInitializer() {
	const [status, setStatus] = useState<string>("Loading session...");

	useEffect(() => {
		async function initSession() {
			try {
				const response = await fetch("/api/session", { method: "POST" });
				if (!response.ok) {
					setStatus("Failed to initialize session");
					return;
				}
				const data = await response.json();
				if (data.isNew) {
					setStatus(
						`Session initialized with random number: ${data.randomNumber}`,
					);
				} else {
					setStatus(
						`Session already exists with random number: ${data.randomNumber}`,
					);
				}
			} catch {
				setStatus("Failed to initialize session");
			}
		}
		initSession();
	}, []);

	return (
		<Typography variant="body1" data-testid="session-status">
			{status}
		</Typography>
	);
}

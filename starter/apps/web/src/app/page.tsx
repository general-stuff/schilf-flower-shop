import { getDb, getDbStatus } from "@flower-shop/lib";
import { add } from "@flower-shop/lib/math";
import { faThumbsUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Box, Container, Typography } from "@mui/material";
import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import type { SessionData } from "../lib/session";
import { sessionOptions } from "../lib/session";
import SessionInitializer from "./SessionInitializer";

export default async function Home() {
	const result = add(1, 2);
	const db = getDb();
	const dbStatus = await getDbStatus(db);
	const session = await getIronSession<SessionData>(
		await cookies(),
		sessionOptions,
	);

	return (
		<Container maxWidth="sm">
			<Box sx={{ textAlign: "center", mt: 8 }}>
				<Typography variant="h3" component="h1" gutterBottom>
					Hello World
				</Typography>
				<Typography variant="h5" gutterBottom>
					1 + 2 = {result}
				</Typography>
				<Typography variant="body1" gutterBottom data-testid="db-status">
					DB status: {dbStatus}
				</Typography>
				<Box sx={{ mt: 2, fontSize: "2rem", color: "primary.main" }}>
					<FontAwesomeIcon icon={faThumbsUp} />
				</Box>
				<Box sx={{ mt: 4 }}>
					<SessionInitializer />
				</Box>
				{session.randomNumber !== undefined && (
					<Typography
						variant="body1"
						sx={{ mt: 2 }}
						data-testid="session-number"
					>
						Session random number: {session.randomNumber}
					</Typography>
				)}
			</Box>
		</Container>
	);
}

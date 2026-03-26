import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import type { SessionData } from "../../../lib/session";
import { sessionOptions } from "../../../lib/session";

export async function GET() {
	const session = await getIronSession<SessionData>(
		await cookies(),
		sessionOptions,
	);

	if (session.randomNumber !== undefined) {
		return Response.json({
			randomNumber: session.randomNumber,
			exists: true,
		});
	}

	return Response.json({ exists: false });
}

export async function POST() {
	const session = await getIronSession<SessionData>(
		await cookies(),
		sessionOptions,
	);

	if (session.randomNumber !== undefined) {
		return Response.json({
			randomNumber: session.randomNumber,
			isNew: false,
		});
	}

	session.randomNumber = Math.floor(Math.random() * 1_000_000);
	await session.save();

	return Response.json({
		randomNumber: session.randomNumber,
		isNew: true,
	});
}

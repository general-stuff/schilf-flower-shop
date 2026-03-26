import type { SessionOptions } from "iron-session";

export interface SessionData {
	randomNumber?: number;
	conversationId?: string;
}

if (!process.env.IRON_SESSION_PASSWORD) {
	throw new Error("IRON_SESSION_PASSWORD environment variable is required");
}

export const sessionOptions: SessionOptions = {
	password: process.env.IRON_SESSION_PASSWORD,
	cookieName: "flower-shop-session",
	cookieOptions: {
		secure: process.env.NODE_ENV === "production",
		httpOnly: true,
		sameSite: "lax" as const,
	},
};

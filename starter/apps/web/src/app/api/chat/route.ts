import { openai } from "@ai-sdk/openai";
import { addOrder, addOrderInputSchema, getDb } from "@flower-shop/lib";
import { stepCountIs, streamText, tool } from "ai";
import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import OpenAI from "openai";
import type { SessionData } from "../../../lib/session";
import { sessionOptions } from "../../../lib/session";

const openaiClient = new OpenAI();

const SYSTEM_PROMPT = `You are a friendly and knowledgeable assistant for a flower shop called "Flower Shop".
You help customers learn about flowers, bouquets, and floral arrangements.
You can answer questions about flower care, meanings of different flowers, seasonal availability, and suggest arrangements for various occasions.
Be warm, helpful, and enthusiastic about flowers.

You can place orders for customers using the placeOrder tool. When a customer wants to order a bouquet, collect:
- Their name (customerName)
- The dominant flower (flowerName)
- Size: S, M, or L
- Color

Small bouquets (S) cost 10€, medium bouquets (M) cost 20€, and large bouquets (L) cost 30€.

Once you have all required information, place the order using the tool and confirm the order details to the customer.`;

export async function POST(req: Request) {
	const { message } = (await req.json()) as { message: string };

	if (!message || typeof message !== "string") {
		return new Response("Missing message", { status: 400 });
	}

	const session = await getIronSession<SessionData>(
		await cookies(),
		sessionOptions,
	);

	if (!session.conversationId) {
		const conversation = await openaiClient.conversations.create();
		session.conversationId = conversation.id;
		await session.save();
	}

	const model = process.env.OPENAI_MODEL ?? "gpt-5.4";

	const db = getDb();

	const result = streamText({
		model: openai.responses(model),
		system: SYSTEM_PROMPT,
		prompt: message,
		tools: {
			placeOrder: tool({
				description:
					"Place a flower order for the customer. Use this when the customer wants to order a bouquet.",
				inputSchema: addOrderInputSchema,
				execute: async (input) => {
					const order = await addOrder(db, input);
					return order;
				},
			}),
		},
		stopWhen: stepCountIs(5),
		providerOptions: {
			openai: {
				conversation: session.conversationId,
			},
		},
	});

	const encoder = new TextEncoder();
	const stream = new ReadableStream({
		async start(controller) {
			try {
				for await (const part of result.fullStream) {
					if (part.type === "text-delta") {
						const sseMessage = `event: text\ndata: ${JSON.stringify(part.text)}\n\n`;
						controller.enqueue(encoder.encode(sseMessage));
					} else if (part.type === "tool-call") {
						const sseMessage = `event: tool_call\ndata: ${JSON.stringify({ toolName: part.toolName, args: part.input })}\n\n`;
						controller.enqueue(encoder.encode(sseMessage));
					}
				}
				controller.enqueue(encoder.encode("event: done\ndata: [DONE]\n\n"));
			} catch (error) {
				const errorMessage =
					error instanceof Error ? error.message : "Unknown error";
				controller.enqueue(
					encoder.encode(
						`event: error\ndata: ${JSON.stringify(errorMessage)}\n\n`,
					),
				);
			} finally {
				controller.close();
			}
		},
	});

	return new Response(stream, {
		headers: {
			"Content-Type": "text/event-stream",
			"Cache-Control": "no-cache",
			Connection: "keep-alive",
		},
	});
}

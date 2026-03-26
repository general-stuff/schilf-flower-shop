import { openai } from "@ai-sdk/openai";
import { getDb, searchFlowers } from "@flower-shop/lib";
import { embed, streamText } from "ai";

const SYSTEM_PROMPT = `You are a knowledgeable flower expert for the "Flower Shop".
You answer questions about flowers based on the provided context.
Only answer questions related to the flowers described in the context below.
If the question is not about flowers, politely decline and suggest asking a flower-related question.

Context:
{context}`;

export async function POST(req: Request) {
	const { question } = (await req.json()) as { question: string };

	if (!question || typeof question !== "string") {
		return new Response("Missing question", { status: 400 });
	}

	const embeddingModel = openai.embedding("text-embedding-3-large");
	const { embedding } = await embed({ model: embeddingModel, value: question });

	const db = getDb();
	const results = await searchFlowers(db, embedding);

	const context = results
		.map((r, i) => `${i + 1}. ${r.description}`)
		.join("\n\n");

	const model = process.env.OPENAI_MODEL ?? "gpt-5.4";

	const result = streamText({
		model: openai(model),
		system: SYSTEM_PROMPT.replace("{context}", context),
		prompt: question,
	});

	const encoder = new TextEncoder();
	const stream = new ReadableStream({
		async start(controller) {
			try {
				for await (const part of result.fullStream) {
					if (part.type === "text-delta") {
						const sseMessage = `event: text\ndata: ${JSON.stringify(part.text)}\n\n`;
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

import { createHash } from "node:crypto";
import { openai } from "@ai-sdk/openai";
import {
	getDb,
	getFlowersToEmbed,
	listFlowers,
	storeFlowerEmbedding,
} from "@flower-shop/lib";
import { embedMany } from "ai";

export async function POST() {
	const db = getDb();
	const idsToEmbed = await getFlowersToEmbed(db);

	if (idsToEmbed.length === 0) {
		return Response.json({ updated: 0 });
	}

	const allFlowers = await listFlowers(db);
	const flowersToEmbed = allFlowers.filter((f) => idsToEmbed.includes(f.id));

	const descriptions = flowersToEmbed.map((f) => f.description);

	const embeddingModel = openai.embedding("text-embedding-3-large");
	const { embeddings } = await embedMany({
		model: embeddingModel,
		values: descriptions,
	});

	for (let i = 0; i < flowersToEmbed.length; i++) {
		const flower = flowersToEmbed[i];
		const hash = createHash("sha256").update(flower.description).digest("hex");
		await storeFlowerEmbedding(db, flower.id, hash, embeddings[i]);
	}

	return Response.json({ updated: flowersToEmbed.length });
}

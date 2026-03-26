import { desc, sql } from "drizzle-orm";
import type { BetterSQLite3Database } from "drizzle-orm/better-sqlite3";
import { z } from "zod";

import { flowers, orders } from "./schema.ts";

type Db = BetterSQLite3Database<Record<string, unknown>>;

export const addOrderInputSchema = z.object({
	customerName: z.string().min(1),
	flowerName: z.string().min(1),
	size: z.enum(["S", "M", "L"]),
	color: z.string().min(1),
});

export type AddOrderInput = z.infer<typeof addOrderInputSchema>;

export const orderSchema = z.object({
	id: z.number(),
	customerName: z.string(),
	orderDate: z.string(),
	flowerName: z.string(),
	size: z.string(),
	color: z.string(),
});

export type Order = z.infer<typeof orderSchema>;

export const listOrdersInputSchema = z.object({
	skip: z.number().int().min(0).optional(),
	top: z.number().int().min(1).max(100).optional(),
});

export type ListOrdersInput = z.infer<typeof listOrdersInputSchema>;

export async function getDbStatus(db: Db) {
	const result = db.get<{ result: number }>(sql`SELECT 42 AS result`);
	return result?.result;
}

export async function fillFlowers(db: Db) {
	db.delete(flowers).run();
	db.insert(flowers)
		.values([
			{
				name: "Rose",
				description:
					"The **rose** is one of the most iconic and beloved flowers worldwide. It symbolizes love, beauty, and passion. Red roses are the classic symbol of romantic love, while pink roses represent gratitude and admiration. White roses stand for purity and innocence, often used in weddings. Yellow roses convey friendship and joy. Roses are appropriate for virtually any occasion — from Valentine's Day and anniversaries to sympathy arrangements and celebrations.",
				colors: "red, pink, white, yellow, orange, lavender",
			},
			{
				name: "Lily",
				description:
					"The **lily** is a majestic flower symbolizing purity, refined beauty, and renewal. White lilies are strongly associated with sympathy and funerals, representing the restored innocence of the departed soul. Stargazer lilies, with their bold pink and white petals, symbolize ambition and prosperity. Orange lilies represent confidence and pride. Lilies are popular in both celebratory and memorial arrangements, making them one of the most versatile flowers in floristry.",
				colors: "white, pink, orange, yellow, red",
			},
			{
				name: "Tulip",
				description:
					"The **tulip** is a spring flower that symbolizes perfect love, rebirth, and new beginnings. Red tulips declare true love, while purple tulips represent royalty and elegance. Yellow tulips have evolved from representing hopeless love to now symbolizing cheerful thoughts and sunshine. White tulips are used to convey forgiveness or respect. Tulips are ideal for spring celebrations, Easter, birthdays, and as a cheerful gesture of affection.",
				colors: "red, yellow, purple, white, pink, orange",
			},
			{
				name: "Daisy",
				description:
					"The **daisy** represents innocence, purity, and simplicity. Its cheerful, open face symbolizes loyal love and new beginnings. Gerbera daisies, with their large, vibrant blooms, convey cheerfulness and are popular in birthday arrangements. The classic white daisy is associated with childhood innocence and is often used in wildflower bouquets. Daisies are perfect for casual occasions, get-well wishes, and celebrations of friendship.",
				colors: "white, yellow, pink, orange, red, purple",
			},
			{
				name: "Sunflower",
				description:
					"The **sunflower** is a bold, radiant bloom symbolizing adoration, loyalty, and longevity. Its tendency to turn toward the sun represents warmth, positivity, and the pursuit of light. Sunflowers are associated with harvest, abundance, and happiness. They are popular in late summer arrangements, housewarming gifts, and as tokens of encouragement. Their bright, open faces bring instant cheer and make a strong visual statement in any bouquet.",
				colors: "yellow, orange, red, brown",
			},
			{
				name: "Orchid",
				description:
					"The **orchid** is an exotic flower symbolizing luxury, beauty, strength, and love. In ancient Greece, orchids were associated with virility, while in Victorian England they represented refined taste and elegance. Phalaenopsis (moth orchids) are the most popular variety, symbolizing grace and sophistication. Purple orchids represent admiration and respect, while white orchids signify elegance and innocence. Orchids are ideal for expressing thoughtful affection and are popular as long-lasting gifts.",
				colors: "white, purple, pink, yellow, orange, blue",
			},
			{
				name: "Poppy",
				description:
					"The **poppy** is a flower rich in symbolism, most notably representing remembrance and honor for fallen soldiers. Red poppies are the universal symbol of sacrifice and are worn on Remembrance Day. Beyond their memorial significance, poppies also symbolize sleep, peace, and imagination. In some traditions, they represent consolation and recovery. Their delicate, papery petals and vivid colors make them a striking choice for arrangements marking transitions, commemorations, and reflective occasions.",
				colors: "red, orange, yellow, white, pink, purple",
			},
			{
				name: "Aetherbell",
				description:
					"Aetherbell is a **high-altitude flower** said to bloom only where cold wind meets bright sunlight on floating cliffs. Its petals are thin and slightly translucent, giving it a glowing appearance at dawn. In symbolism, Aetherbell represents clarity of thought, impossible ambitions, and the courage to continue despite uncertainty. It is often associated with moments of personal breakthrough, visionary projects, and ceremonies celebrating bold new beginnings. In traditions, it is given to inventors, explorers, and people starting a journey with no guaranteed outcome. Its meaning is less about romance and more about insight, aspiration, and the beauty of pursuing what others consider unreachable.",
				colors: "silver-blue, pale violet, frost white",
			},
			{
				name: "Emberveil",
				description:
					"Emberveil is a **desert flower** known for its dark, velvety petals and warm metallic shimmer, as if holding the memory of fire. It is said to open only at sunset and retain heat long after the air has cooled. Symbolically, Emberveil stands for resilience, hidden passion, and the strength to endure hardship without losing inner warmth. It is commonly linked to occasions involving recovery, reconciliation, and honoring someone who has overcome a difficult period. In folklore, it is exchanged not during first love, but after trust has been rebuilt. Unlike gentle celebratory flowers, Emberveil carries a deeper meaning of survival, loyalty, and emotional endurance forged under pressure.",
				colors: "burnt orange, deep crimson, smoky black, copper",
			},
			{
				name: "Mirelume",
				description:
					"Mirelume is a **marsh flower** with round lantern-like blossoms that emit a faint bioluminescent glow at night. It grows in still wetlands and is often described as guiding lost travelers through fog. Its symbolism centers on remembrance, quiet guidance, and kindness offered without recognition. Mirelume is typically used in memorial gatherings, nighttime festivals, and rituals meant to honor ancestors or forgotten stories. It does not symbolize grief alone, but rather the comforting presence of memory and the idea that the past can still illuminate the present. In contrast to dramatic flowers of passion or ambition, Mirelume represents gentle support, emotional depth, and the unseen acts of care that help others find their way.",
				colors: "mint green, moonlit cyan, soft amber",
			},
		])
		.run();
}

export async function listFlowers(db: Db) {
	return db.select().from(flowers).all();
}

export async function addOrder(db: Db, input: AddOrderInput): Promise<Order> {
	const orderDate = new Date().toISOString();
	const result = db
		.insert(orders)
		.values({
			customerName: input.customerName,
			orderDate,
			flowerName: input.flowerName,
			size: input.size,
			color: input.color,
		})
		.returning()
		.get();
	return result;
}

export async function listOrders(
	db: Db,
	params?: ListOrdersInput,
): Promise<Order[]> {
	const skip = params?.skip ?? 0;
	const top = params?.top ?? 10;
	return db
		.select()
		.from(orders)
		.orderBy(desc(orders.orderDate))
		.limit(top)
		.offset(skip)
		.all();
}

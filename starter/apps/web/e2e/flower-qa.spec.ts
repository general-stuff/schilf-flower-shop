import { expect, test } from "@playwright/test";

test("flower Q&A page can be loaded and user can send a message", async ({
	page,
}) => {
	test.setTimeout(120_000);

	await page.goto("/flower-qa");

	// Wait for embeddings to finish loading
	const input = page.getByTestId("flower-qa-input");
	await expect(input).toBeVisible({ timeout: 90_000 });

	const sendButton = page.getByTestId("flower-qa-send-button");
	await expect(sendButton).toBeVisible();
});

test("bot answers a flower-related question", async ({ page }) => {
	test.setTimeout(120_000);

	await page.goto("/flower-qa");

	const input = page.getByTestId("flower-qa-input");
	await expect(input).toBeVisible({ timeout: 90_000 });

	await input.fill("What does a rose symbolize?");

	const sendButton = page.getByTestId("flower-qa-send-button");
	await sendButton.click();

	const answer = page.getByTestId("flower-qa-answer");
	await expect(answer).toBeVisible({ timeout: 60_000 });
	await expect(answer).not.toBeEmpty({ timeout: 60_000 });
});

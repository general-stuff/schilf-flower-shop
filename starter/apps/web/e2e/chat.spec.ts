import { expect, test } from "@playwright/test";

test("chat page has input area, send button, and empty chat history", async ({
	page,
}) => {
	await page.goto("/chat");

	const input = page.getByTestId("chat-input");
	await expect(input).toBeVisible();

	const sendButton = page.getByTestId("chat-send-button");
	await expect(sendButton).toBeVisible();

	const chatHistory = page.getByTestId("chat-history");
	await expect(chatHistory).toBeVisible();
	await expect(chatHistory).toBeEmpty();
});

test("bot responds to a message within 60 seconds", async ({ page }) => {
	test.setTimeout(60_000);

	await page.goto("/chat");

	const input = page.getByTestId("chat-input");
	await input.fill("Hi");

	const sendButton = page.getByTestId("chat-send-button");
	await sendButton.click();

	const chatHistory = page.getByTestId("chat-history");
	const assistantMessage = chatHistory.locator(".chat-message--assistant");
	await expect(assistantMessage).toBeVisible({ timeout: 55_000 });

	const bubble = assistantMessage.locator(".chat-message__bubble");
	await expect(bubble).not.toBeEmpty({ timeout: 55_000 });
});

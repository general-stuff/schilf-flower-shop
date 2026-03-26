import { expect, test } from "@playwright/test";

test("place an order via chat and verify it appears on the orders page", async ({
	page,
}) => {
	test.setTimeout(120_000);

	await page.goto("/chat");

	const input = page.getByTestId("chat-input");
	await input.fill(
		"I want to order a large red rose bouquet. My name is TestCustomerE2E.",
	);

	const sendButton = page.getByTestId("chat-send-button");
	await sendButton.click();

	// Wait for the tool call event to appear
	const toolCall = page.getByTestId("tool-call");
	await expect(toolCall).toBeVisible({ timeout: 60_000 });

	// Wait for the assistant to finish responding
	const chatHistory = page.getByTestId("chat-history");
	const assistantMessage = chatHistory.locator(".chat-message--assistant");
	await expect(assistantMessage.first()).toBeVisible({ timeout: 60_000 });
	const bubble = assistantMessage.first().locator(".chat-message__bubble");
	await expect(bubble).not.toBeEmpty({ timeout: 60_000 });

	// Wait 500ms, then navigate to orders page
	await page.waitForTimeout(500);
	await page.goto("/orders");

	// Verify the order appears as the most recent
	const firstRow = page.getByTestId("order-row").first();
	await expect(firstRow).toBeVisible({ timeout: 10_000 });
	await expect(firstRow.getByTestId("order-customer")).toHaveText(
		"TestCustomerE2E",
	);
});

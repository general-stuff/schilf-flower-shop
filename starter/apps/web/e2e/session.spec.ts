import { expect, test } from "@playwright/test";

test("session random number persists across page reloads", async ({ page }) => {
	await page.goto("/");

	// Wait for the session initializer to set the random number
	const statusElement = page.getByTestId("session-status");
	await expect(statusElement).toContainText("random number:");

	// Extract the random number from the status message
	const statusText = await statusElement.textContent();
	const match = statusText?.match(/random number: (\d+)/);
	expect(match).toBeTruthy();
	const randomNumber = match?.[1];

	// Reload the page
	await page.reload();

	// Wait for the session number to appear in the server-rendered element
	const sessionNumber = page.getByTestId("session-number");
	await expect(sessionNumber).toContainText(
		`Session random number: ${randomNumber}`,
	);

	// Also verify the client component shows "already exists"
	await expect(statusElement).toContainText(
		`Session already exists with random number: ${randomNumber}`,
	);
});

import { expect, test } from "@playwright/test";

test("home page displays Hello World", async ({ page }) => {
	await page.goto("/");
	await expect(
		page.getByRole("heading", { name: "Hello World" }),
	).toBeVisible();
	await expect(page.getByText("1 + 2 = 3")).toBeVisible();
});

test("home page displays DB status", async ({ page }) => {
	await page.goto("/");
	await expect(page.getByTestId("db-status")).toHaveText("DB status: 42");
});

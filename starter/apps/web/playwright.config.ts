import { defineConfig } from "@playwright/test";

export default defineConfig({
	testDir: "./e2e",
	fullyParallel: true,
	forbidOnly: !!process.env.CI,
	retries: process.env.CI ? 2 : 0,
	use: {
		baseURL: "http://localhost:3099",
	},
	webServer: {
		command: "pnpm build && pnpm start -p 3099",
		url: "http://localhost:3099",
		reuseExistingServer: !process.env.CI,
	},
});

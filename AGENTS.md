<background>
This is a sample project for learning how to work with AI in web applications. The scenario is a a flower shop. Customers can use the bot to put together one of more bouquets and order them.
</background>

<documentation-and-samples>
If you need to consider up-to-date documentation and samples (e.g. because you are performing an important task, you are specifically asked to, etc.), consult the following URLs and MCP servers:

* For next.js:
  * Documentation: https://nextjs.org/docs/llms.txt
  * Context7 library ID: vercel/next.js
* For AI SDK:
  * Context7 library ID: websites/ai-sdk_dev
* For Drizzle ORM:
  * Documentation: https://orm.drizzle.team/llms.txt
  * Context7 library ID: llmstxt/orm_drizzle_team_llms_txt
* For Biome.js:
  * Context7 library ID: biomejs/biome
* For Vitest:
  * Documentation: https://vitest.dev/llms.txt
  * Context7 library ID: vitest-dev/vitest
* For Material UI (MUI):
  * Documentation: https://mui.com/material-ui/llms.txt
  * Context7 library ID: mui/material-ui
* tRPC:
  * Documentation: https://trpc.io/llms.txt
  * Context7 library ID: websites/trpc_io
</documentation-and-samples>

<package-manager>
Use pnpm as package manager.
</package-manager>

<files>
Inspect `package.json` to see the dependencies with versions and scripts.

Ignore all files in the `presentation` folder unless you are explicitly asked to read one of them.
</files>

<nextjs-guidelines>
* Use App Router
* Use Server Components for data fetching
* Use Client Components for UI components that need to be interactive
* Use tRPC for API calls only if needed (prefer Server Components)
* When generating UI-related code, only write end-to-end tests if explicitly asked to
* Use regular CSS (modern, with nested selectors), no Tailwind
* Limit global styles to a minimum, prefer local styles
* Use self-hosted Google Fonts as specified in the brand guidelines
</nextjs-guidelines>

<quality-assurance>
After updating or adding any code, make sure that linting, formatting, type checking and unit tests pass without errors/warnings.

Always install dependencies using pnpm. Always install the latest version if not explicitly asked to use a specific version. Do NOT add dependencies manually to `package.json`.

Do not run Playwright tests unless you are explicitly asked to.
</quality-assurance>

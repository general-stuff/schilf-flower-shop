# SCHILF Flower Shop

## Introduction

This is a sample project for learning how to work with AI in web applications. The scenario is a a flower shop. Customers can use the bot to put together one of more bouquets and order them.

## System Requirements

* [Node.js](https://nodejs.org/en)
* [pnpm](https://pnpm.io/installation)
* [Context7 MCP Server](https://github.com/upstash/context7)
* For browser testing:
  * If you use Claude: [Use Claude with Chrome](https://code.claude.com/docs/en/chrome)
  * If you use GitHub Copilot: [Install Playwright CLI](https://github.com/microsoft/playwright-cli?tab=readme-ov-file#installation)

## Workshop Storybook

### Overview

This workshop shows how an AI-enabled application can be built step by step from precise prompts. Starting with project scaffolding and ending with RAG and MCP integration, the participants see how a spec can guide architecture, tests, UI decisions, data modeling, and AI features.

It also shows why this kind of setup is challenging for AI coding. Some parts rely on relatively new libraries and APIs such as the Vercel AI SDK and the OpenAI Conversation API, which may have appeared after the knowledge cutoff of many frontier models. In addition, the workflow is not just about generating code once. The agent has to work in a loop with linting, strict type checking, unit tests, and end-to-end tests until the implementation is correct and stable.

The broader takeaway is that prompts can be used as working specifications: they describe intent, constrain implementation choices, and make progress easier to review after every step.

### Chapter 1: Create the Workspace

The workshop starts by creating a clean workspace with a shared library, a web app, and a console app. The key learning is that spec-driven work begins with structure: clear boundaries, shared tooling, and explicit quality gates make later AI-assisted changes easier to manage.

### Chapter 2: Session Management

Next, the app gains server-backed session state. This chapter shows that even a simple requirement like "remember something across reloads" touches API design, server rendering, client behavior, and end-to-end tests. It is also a useful example of how a short prompt can describe full-stack behavior.

### Chapter 3: Drizzle and SQLite

Here the sample app becomes a data-driven system. Participants introduce a database, migrations, a data access layer, and a CLI that reuses the same logic. The main lesson is separation of concerns: the prompt keeps persistence logic out of the UI and turns the library into the reusable core of the solution.

### Chapter 4: Filling the Database via Web App

The workshop then replaces demo UI with the first real workflow in the web app. Attendees learn how to turn backend capabilities into a small but complete user journey, including loading states, refresh behavior, modal details, and cleanup of earlier scaffolding. This reinforces iterative delivery instead of trying to build the final product in one step.

### Chapter 5: Chat Bot

This is where the app becomes visibly AI-enabled. The participants add a streaming chat UI, connect it to the OpenAI Responses and Conversations APIs, and manage the conversation ID securely in the session. The learning here is that AI features still depend on standard engineering fundamentals such as protocol handling, sanitization, state management, and testing.

### Chapter 6: Load Conversation History

Once chat works, the next step is continuity. Reloading the page should restore the earlier exchange, and users should also be able to start over. This chapter shows that AI apps need lifecycle design, not just prompt design, and that real APIs often require retry logic and resilient tests.

### Chapter 7: Orders

The bot now becomes useful by placing structured orders through a function tool. Alongside that, the app gets an orders page and the CLI grows with matching capabilities. The main takeaway is how natural language can be connected to validated business operations through schemas, tool calls, and observable events rather than opaque model behavior.

### Chapter 8: RAG

In this part, the application learns to answer flower-related questions based on its own data. Participants build the full retrieval pipeline: generate embeddings, store them, search for similar content, and ground the answer in the retrieved records. It shows how an advanced AI feature can be broken down into understandable, testable building blocks.

### Chapter 9: MCP Server

The final chapter exposes the existing order functionality through an MCP server. This shows the result of the earlier architectural decisions: once the core business logic is cleanly separated, the same capabilities can be surfaced through the web app, the CLI, and external AI tools. It closes the workshop by showing how modular design supports reuse.

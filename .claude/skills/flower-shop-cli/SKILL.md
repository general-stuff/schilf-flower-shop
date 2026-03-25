---
name: flower-shop-cli
description: Use this skill to interact with the Flower Shop CLI.
---

# Flower Shop CLI

The Flower Shop CLI is a Commander.js-based console application located in `apps/console`. It provides commands for managing the flower shop database.

## Running the CLI

Run commands from the **project root** using pnpm:

```bash
pnpm --filter console exec tsx src/index.ts <command>
```

## Available Commands

### `ping` — Database health check

Executes `SELECT 42 AS result` against the database to verify connectivity.

```bash
pnpm --filter console exec tsx src/index.ts ping
```

### `fill` — Populate demo data

Clears the `flowers` table and inserts 10 demo flowers (7 real + 3 fictitious).

```bash
pnpm --filter console exec tsx src/index.ts fill
```

### `list` — List all flowers

Returns all flowers from the database as formatted JSON.

```bash
pnpm --filter console exec tsx src/index.ts list
```

### `list-orders` — List recent orders

Returns the most recent orders from the database as formatted JSON (default: 10).

```bash
pnpm --filter console exec tsx src/index.ts list-orders
```

### `add-order` — Add an order

Reads order data as JSON from STDIN and inserts it into the database. Returns the complete order object including the generated ID and order date.

Required JSON fields: `customerName`, `flowerName`, `size` (`S`, `M`, or `L`), `color`.

```bash
echo '{"customerName":"Alice","flowerName":"Rose","size":"M","color":"red"}' | pnpm --filter console exec tsx src/index.ts add-order
```

### `mcp` — Start an MCP server

Starts a Model Context Protocol (MCP) server using stdio transport. The server exposes two tools for LLM clients:

- **`list-orders`** — List recent orders with optional `skip`/`top` pagination.
- **`place-order`** — Place a new bouquet order (`customerName`, `flowerName`, `size`, `color`).

The MCP server does **not** print any output to stdout (stdout is reserved for JSON-RPC protocol messages). Log messages are written to stderr.

```bash
pnpm --filter console exec tsx src/index.ts mcp
```

#### Testing with MCP Inspector

Use the [MCP Inspector](https://github.com/modelcontextprotocol/inspector) to interactively test the server:

```bash
npx @modelcontextprotocol/inspector pnpm --filter console exec tsx src/index.ts mcp
```

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

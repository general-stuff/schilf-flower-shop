---
name: flower-shop-cli
description: "Use this skill to interact with the Flower Shop CLI."
user_invocable: false
---

The Flower Shop CLI is a command-line tool for managing the flower shop database.

## How to run

Run from the project root using pnpm:

```bash
pnpm console <command>
```

## Available commands

### `ping`
Check database connectivity (health check).

```bash
pnpm console ping
```

### `fill`
Clear and fill the database with demo flower data (10 flowers including 7 real and 3 fictitious).

```bash
pnpm console fill
```

### `list`
List all flowers in the database as JSON.

```bash
pnpm console list
```

### `list-orders`
List the most recent orders as JSON.

```bash
pnpm console list-orders
```

### `add-order`
Add an order. Order data must be passed via STDIN in JSON format.

```bash
echo '{"customerName":"Alice","flowerName":"Rose","size":"M","color":"red"}' | pnpm console add-order
```

Example JSON for an order:
```json
{
  "customerName": "Alice",
  "flowerName": "Rose",
  "size": "M",
  "color": "red"
}
```

Fields:
- `customerName` (string, required) — the customer's name
- `flowerName` (string, required) — the dominant flower in the bouquet
- `size` (string, required) — one of "S", "M", or "L"
- `color` (string, required) — the color of the bouquet

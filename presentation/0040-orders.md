# Orders

## Database

* Add a new table `orders` to the schema in the library:
  * Generated PK (surrogate key)
  * Customer name
  * Order date (ISO 8601, stored as UTC timestamp)
  * Flower name (in our simplified example, we only have a single, dominant flower per bouquet)
  * Size (string; possible values S, M, L)
  * Color (string)
* Create and apply the migration.

## Data Access (library)

Add the following functions to the data access library:
* `addOrder(order)` — inserts an order into the database; generated PK and order date are generated internally; returns the complete order object with the generated PK and order date
* `listOrders(skip?, top?)` — returns the most recent orders ordered by order date descending; defaults to skip 0 and top 10, configurable via the `skip` and `top` parameters;
  * skip must be undefined or >= 0
  * top must be undefined or (>= 1 and <= 100)

Add Zod schemas for the inputs and outputs of all functions and export them from the library.

## Orders UI

Add a new page to the web app that lists all orders.

* Display a list of orders from `listOrders`.
* Add a simple pagination to the UI (10 orders per page).
* Show only order date, customer name, flower name, and size.

## Chat Bot — Function Tool

* Add a function tool to the bot that allows the AI to place an order on behalf of the customer.
  * The tool receives the full order (all columns except the generated PK and the order date) and persists it via `addOrder`.
  * Reuse the Zod schema for tool arguments (structured output).
  * The tool must return the complete order object with the generated PK and order date to the agent.
* The streaming API endpoint must send a dedicated named SSE event whenever a tool call occurs, including the tool name and its arguments.
* On the client side, visualize tool call events by rendering the tool name.
  * Expandable to show the tool call details (`pre`).
* Adjust the system prompt to use the function tool.

## Console App — Commander.js

Enhance the CLI:

* Command to list orders
* Command to add an order. Order data must be passed via STDIN in JSON format.

Extend the `flower-shop-cli` skill to describe the new commands. Include an example JSON for an order.

## End-to-End Testing

* Add an end-to-end test that specifies the data of a new order in a single input.
* Ensure that tool call event is visible in the chat history.
* Wait for 500ms, then navigate to the orders page and verify that the order is listed as the most recent order.

## Acceptance Criteria

* Everything compiles, lints, formats, and type checks without errors/warnings.
* End-to-end tests pass without errors/warnings.
* You tried to add one order via the CLI and verified that the CLI returns the new order in the order list.

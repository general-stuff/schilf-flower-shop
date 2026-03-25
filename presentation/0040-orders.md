# Orders

## Database

* Add two new tables to schema in library:
  * `orders`: generated PK (surrogate key), customer name, address (single string), order date (ISO 8601, stored as UTC timestamp)
  * `order_details` (bouquets belonging to an order): generated PK (surrogate key), foreign key to `orders`, flower name, size (enum: S, M, L), color
* Create and apply the migration.

## Data Access (library)

Add the following functions to `packages/lib`:

* `addOrder(order)` — inserts an order together with optional order details (bouquets) in a single transaction; returns generated ID
* `getOrderById(id)` — returns a single order with its details (bouquets), or `undefined` if not found
* `getOrderDetailById(id)` — returns a single order detail (bouquet) with its details, or `undefined` if not found
* `removeOrderDetailById(id)` — removes a single order detail (bouquet) by its ID
* `addOrderDetail(orderId, orderDetail)` — inserts a single order detail (bouquet) into the database; returns generated ID
* `listOrders(top?)` — returns the most recent orders (without details) ordered by order date descending; defaults to top 10, configurable via the `top` parameter
* `listOrderDetails(orderId)` — returns all order details (bouquets) for a given order ID

Add Zod schemas for the inputs and outputs of all functions and export them from the library.

## Chat Bot — Function Tool

* Add a function tool to the bot that allows the AI to place an order on behalf of the customer.
  * The tool receives the full order (customer name, address, and list of bouquets) and persists it via `addOrder`.
  * Reuses zod schema for tool arguments (structured output).
* The streaming API endpoint must send a dedicated named SSE event whenever a tool call occurs, including the tool name and its arguments.
* On the client side, visualize tool call events by rendering the tool name.
  * Unfoldable to see tool call details (`pre`).
* Adjust the system prompt to use the function tool.

## Console App — Commander.js

* Add `commander` to the console app.
* Add a `list` command that lists orders using `listOrders`.
  * The command accepts an optional `--top <n>` option to configure how many orders to retrieve (default: 10).
  * Print the results to stdout in a human-readable format.

## End-to-End Testing

* Add an end-to-end test that specifies a data of a new order in a single input.
* Ensure that tool call event is visible in the chat history.
* Use the `listOrders` function in the library to verify that the order was created.

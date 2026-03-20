Add Drizzle ORM with SQLite (via `better-sqlite3`) to the existing Next.js project. Research the latest Drizzle ORM documentation to ensure you follow current best practices.

## Requirements

### Database Setup

* Use SQLite as the database engine with `better-sqlite3` as the driver.
* The SQLite database file location must be configurable via environment variables:
  * `DB_FOLDER` — folder where the database file is stored (default: `./data`)
  * `DB_NAME` — name of the database file (default: `flower_shop.db`)
* Add the database folder and `*.db` files to `.gitignore`.
* Add a `.env.local` file with the default values for the environment variables.
* Make sure to add scripts for generating and applying migrations.

### Schema

* Create a demo table `flowers` with the following columns:
  * `id` — integer, primary key, auto-increment
  * `name` — text, not null
  * `color` — text, not null
  * `price_cents` — integer, not null

### Data Access Layer

* Create a data access layer that is cleanly separated from any UI code.
* The data access layer must export:
  * The Drizzle database client instance.
  * A function (e.g. `getDbStatus`) that executes `SELECT 42 AS result` and returns the result. This serves as a simple health-check query.

### UI Integration

* Update the existing home page (`app/page.tsx`) so that it calls the `getDbStatus` function from the data access layer and displays the query result (e.g. "DB status: 42") alongside the existing "Hello world!" text.
* The page must be a **Server Component** — no client-side data fetching.

## Acceptance Criteria

* Migrations have been generated and applied
* SQLite database file has been created
* Home page displays the DB health-check result

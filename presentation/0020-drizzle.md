Add Drizzle ORM with SQLite (via `better-sqlite3`) to the existing Next.js project. Research the latest Drizzle ORM documentation to ensure you follow current best practices.

## Requirements

### Database Setup

* Use SQLite as the database engine with `better-sqlite3` as the driver.
* The SQLite database file location must be configurable via .env.local (during development) and environment variables (during production):
  * `DB_FOLDER` — folder where the database file is stored (default: `./data` relative to the project root folder)
  * `DB_NAME` — name of the database file (default: `flower_shop.db`)
* Add the database folder and `*.db` files to `.gitignore`.
* Make sure to add scripts for generating and applying migrations to the `package.json` scripts.

### Schema

* Create a demo table `flowers` with the following columns:
  * `id` — PK (surrogate key)
  * `name` — text, not null (e.g. "Rose", "Lily", "Tulip")
  * `description` — longer text, not null (description of the flower including its meaning, symbolism, typical occasions, etc.), can contain markdown formatting
  * `colors` - comma-separated list of available colors (e.g. "red, pink, white")

### Data Access Layer

* Create a data access layer that is cleanly separated from any UI code.
* Don't forget: Data access code must be in the library, not in the web or console apps.
* The data access layer must export:
  * The Drizzle database client instance (exported function `getDb()`).
  * A function (e.g. `getDbStatus`) that executes something like `SELECT 42 AS result` and returns the result. This serves as a simple health-check query.
  * A function `fillFlowers` that clears the `flowers` table and inserts meaningful demo data for the following flowers:
    * Rose
    * Lily
    * Tulip
    * Daisy
    * Sunflower
    * Orchid
    * Poppy
    * Additionally, add three fictitious flowers (see below) to the `flowers` table:

      ```json
      [
        {
          "name": "Aetherbell",
          "description": "Aetherbell is a **high-altitude flower** said to bloom only where cold wind meets bright sunlight on floating cliffs. Its petals are thin and slightly translucent, giving it a glowing appearance at dawn. In symbolism, Aetherbell represents clarity of thought, impossible ambitions, and the courage to continue despite uncertainty. It is often associated with moments of personal breakthrough, visionary projects, and ceremonies celebrating bold new beginnings. In traditions, it is given to inventors, explorers, and people starting a journey with no guaranteed outcome. Its meaning is less about romance and more about insight, aspiration, and the beauty of pursuing what others consider unreachable.",
          "colors": "silver-blue, pale violet, frost white"
        },
        {
          "name": "Emberveil",
          "description": "Emberveil is a **desert flower** known for its dark, velvety petals and warm metallic shimmer, as if holding the memory of fire. It is said to open only at sunset and retain heat long after the air has cooled. Symbolically, Emberveil stands for resilience, hidden passion, and the strength to endure hardship without losing inner warmth. It is commonly linked to occasions involving recovery, reconciliation, and honoring someone who has overcome a difficult period. In folklore, it is exchanged not during first love, but after trust has been rebuilt. Unlike gentle celebratory flowers, Emberveil carries a deeper meaning of survival, loyalty, and emotional endurance forged under pressure.",
          "colors": "burnt orange, deep crimson, smoky black, copper"
        },
        {
          "name": "Mirelume",
          "description": "Mirelume is a **marsh flower** with round lantern-like blossoms that emit a faint bioluminescent glow at night. It grows in still wetlands and is often described as guiding lost travelers through fog. Its symbolism centers on remembrance, quiet guidance, and kindness offered without recognition. Mirelume is typically used in memorial gatherings, nighttime festivals, and rituals meant to honor ancestors or forgotten stories. It does not symbolize grief alone, but rather the comforting presence of memory and the idea that the past can still illuminate the present. In contrast to dramatic flowers of passion or ambition, Mirelume represents gentle support, emotional depth, and the unseen acts of care that help others find their way.",
          "colors": "mint green, moonlit cyan, soft amber"
        }
      ]
      ```

  * A function `listFlowers` that returns all flowers from the database as JSON.
* Add integration tests that test the functions mentioned above **with an SQLite in-memory database**.

### UI Integration

* Update the existing home page (`app/page.tsx`) so that it calls the `getDbStatus` function from the data access layer and displays the query result (e.g. "DB status: 42") alongside the existing "Hello world!" text.
* The page must be a **Server Component** — no client-side data fetching.
* Add a call to `getDbStatus` to the console app, too, to make sure DB access works.

## Console App — Commander.js

* Remove the existing demo logic from the console app.
* Add `commander` to the console app for implementing a CLI.
* Add a `ping` command that calls `getDbStatus` and prints the result to stdout. This serves as a simple health-check.
* Add a `fill` command that calls `fillFlowers` to insert the demo data into the database.
* Add a `list` command that calls `listFlowers` and prints the result to stdout.

## Acceptance Criteria

* Migrations have been generated and applied
* SQLite database file has been created
* Home page displays the DB health-check result
* There is an end-to-end test verifying the DB result on the home page
* Console app displays the DB health-check result
* Console app filled the demo data into the database
* Everything compiles, lints, formats, and type checks without errors/warnings

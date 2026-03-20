Create a workspace for our project. It must contain three projects:

* A library with business logic and data access layer (no UI)
* A Next.js project that uses the library
* A console app that uses the library

## General Rules

* Use pnpm as package manager
* Use TypeScript
* Use Biome.js for linting and formatting
* Use tsc for type checking
* Use Vitest for unit testing
* Use the latest version of all dependencies. Research documentation to ensure you are following latest good practices.

## Library

For now, the libary should just export a `math` module with an `add` function. This is just an example that we will replace later.

The library must also contain unit tests with Vitest. Add a demo test for the `add` function.

## Next.js project

Create a new Next.js project with App Router in the current folder. Replace ESLint with Biome.js.

The application should consist of a single page that displays _Hello World_ and the result of calling the `add` function from the library.

We do not need any automated tests for the Next.js project for now.

## Console app

The console app must display the result of calling the `add` function from the library with 22 and 20 as arguments.

We do not need any automated tests for the console app for now.

## Acceptance criteria

* Workspace has been created
* All projects have been created
* Root `package.json` contains scripts for linting, formatting, type checking, testing, starting web app, and running console app
* All projects have been linted, formatted, and type checked without errors/warnings
* `npm outdated` shows no outdated dependencies
* Tests have been run and passed
* You ran the console app and verified its output
* You started the Next.js project and used the Chrome browser to verify its result

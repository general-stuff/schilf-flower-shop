import { existsSync, mkdirSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import { migrate } from "drizzle-orm/better-sqlite3/migrator";
import * as schema from "./schema.ts";

const __dirname = dirname(fileURLToPath(import.meta.url));
const migrationsFolder = resolve(__dirname, "../../drizzle");

let db: ReturnType<typeof drizzle> | undefined;

export function getDb(dbPath?: string) {
	if (db) {
		return db;
	}

	const resolvedPath = dbPath ?? getDefaultDbPath();
	const sqlite = new Database(resolvedPath);
	sqlite.pragma("journal_mode = WAL");
	db = drizzle({ client: sqlite, schema });
	migrate(db, { migrationsFolder });
	return db;
}

export function createDb(dbPath: string) {
	const sqlite = new Database(dbPath);
	sqlite.pragma("journal_mode = WAL");
	const instance = drizzle({ client: sqlite, schema });
	migrate(instance, { migrationsFolder });
	return instance;
}

function findWorkspaceRoot(): string {
	let dir = process.cwd();
	while (dir !== dirname(dir)) {
		if (existsSync(join(dir, "pnpm-workspace.yaml"))) {
			return dir;
		}
		dir = dirname(dir);
	}
	return process.cwd();
}

function getDefaultDbPath(): string {
	const root = findWorkspaceRoot();
	const folder = process.env.DB_FOLDER ?? join(root, "data");
	const name = process.env.DB_NAME ?? "flower_shop.db";

	if (!existsSync(folder)) {
		mkdirSync(folder, { recursive: true });
	}

	return join(folder, name);
}

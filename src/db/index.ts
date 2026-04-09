import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

// Lazy initialization to avoid connecting at build time
let _client: ReturnType<typeof postgres> | null = null;
let _db: ReturnType<typeof drizzle> | null = null;

function getClient() {
  if (!_client) {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      throw new Error(
        "DATABASE_URL environment variable is not set. Please configure it in .env.local"
      );
    }
    _client = postgres(connectionString, {
      max: 1,
      prepare: false,
      ssl: "require",
    });
  }
  return _client;
}

export function getDb() {
  if (!_db) {
    _db = drizzle(getClient(), { schema });
  }
  return _db;
}

// Proxy-based lazy export — only connects when a property is actually accessed
export const db: ReturnType<typeof drizzle> = new Proxy(
  {} as ReturnType<typeof drizzle>,
  {
    get(_target, prop) {
      return Reflect.get(getDb(), prop);
    },
  }
);

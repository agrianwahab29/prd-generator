import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

// Lazy initialization to avoid connecting at build time
let _db: ReturnType<typeof drizzle> | null = null;

export function getDb() {
  if (!_db) {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      throw new Error(
        "DATABASE_URL environment variable is not set. Please configure it in your environment"
      );
    }
    
    const client = postgres(connectionString, {
      max: 1,
      prepare: false,
      ssl: "require",
    });
    
    _db = drizzle(client, { schema });
  }
  return _db;
}

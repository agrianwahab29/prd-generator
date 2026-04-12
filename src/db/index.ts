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
      connect_timeout: 10,   // 10 seconds to connect
      idle_timeout: 20,      // Close idle connections after 20s
      max_lifetime: 60 * 30,  // Renew connections after 30 min
      fetch_types: false,     // Skip type fetching for faster startup
    });
    
    _db = drizzle(client, { schema });
  }
  return _db;
}

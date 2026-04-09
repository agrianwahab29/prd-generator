import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { getDb } from "@/db";
import * as schema from "@/lib/auth/db-schema";

export const auth = betterAuth({
  database: drizzleAdapter(
    // Lazy — getDb() is only called when auth actually needs the database
    {
      get db() {
        return getDb();
      },
    } as Parameters<typeof drizzleAdapter>[0],
    {
      provider: "pg",
      schema: schema,
    }
  ),

  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
  },

  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
    github: {
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    },
  },

  plugins: [nextCookies()],
});

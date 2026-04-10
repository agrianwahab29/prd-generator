import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";
import { Pool } from "pg";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL environment variable is not set");
}

export const auth = betterAuth({
  database: new Pool({
    connectionString,
    ssl: {
      rejectUnauthorized: false,
    },
  }),

  // Use UUID for ID generation (compatible with PostgreSQL)
  advanced: {
    database: {
      generateId: () => crypto.randomUUID(),
    },
  },

  // Handle database hooks to ensure required fields
  databaseHooks: {
    user: {
      create: {
        before: async (user) => {
          // Ensure name is set - fallback to email prefix or 'User' if not provided
          // This handles OAuth providers that may not always provide a name
          const name = user.name || (user.email ? user.email.split('@')[0] : 'User');
          
          return {
            data: {
              ...user,
              name,
              emailVerified: user.emailVerified ?? false,
            },
          };
        },
      },
    },
  },

  // Map Better Auth camelCase fields to database snake_case columns
  user: {
    fields: {
      emailVerified: "email_verified",
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  },

  session: {
    fields: {
      userId: "user_id",
      expiresAt: "expires_at",
      ipAddress: "ip_address",
      userAgent: "user_agent",
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  },

  account: {
    fields: {
      userId: "user_id",
      accountId: "account_id",
      providerId: "provider_id",
      accessToken: "access_token",
      refreshToken: "refresh_token",
      idToken: "id_token",
      accessTokenExpiresAt: "access_token_expires_at",
      refreshTokenExpiresAt: "refresh_token_expires_at",
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  },

  verification: {
    fields: {
      expiresAt: "expires_at",
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  },

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

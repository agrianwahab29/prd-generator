import { createAuthClient } from "better-auth/react";

// Use environment variable if available, otherwise use relative URLs
// This ensures auth requests go to the correct origin in both dev and production
const baseURL = process.env.NEXT_PUBLIC_APP_URL || undefined;

export const authClient = createAuthClient({
  baseURL,
});

export const {
  signIn,
  signUp,
  signOut,
  useSession,
  getSession,
} = authClient;

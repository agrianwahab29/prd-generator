"use client";

import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth/auth-client";

export function SignOutButton() {
  const handleSignOut = async () => {
    try {
      await authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            window.location.href = "/login";
          },
        },
      });
    } catch (error) {
      console.error("Sign out failed:", error);
      // Fallback: redirect even if sign-out fails
      window.location.href = "/login";
    }
  };

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      className="h-8 w-8 text-[#64748B] hover:text-[#F43F5E]"
      onClick={handleSignOut}
    >
      <LogOut className="h-4 w-4" />
    </Button>
  );
}

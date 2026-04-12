import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getUserSettings, getUserProfile } from "@/app/actions/settings";
import { SettingsContent } from "@/components/settings-content";

export default async function SettingsPage() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      redirect("/login");
    }

    // Server-side data fetch with error handling
    let profile = null;
    let settings = null;
    
    try {
      [profile, settings] = await Promise.all([
        getUserProfile(),
        getUserSettings(),
      ]);
    } catch (dbError) {
      console.error("Settings page - Database error:", dbError);
      // Return defaults if database fails
      profile = { name: session.user.name || "", email: session.user.email || "", image: session.user.image || "" };
      settings = { 
        apiProvider: "gemini", 
        apiModel: "auto", 
        hasCustomApiKey: false,
        language: "id",
        notifyPrdGenerated: true,
        notifyEmailUpdates: true,
        notifyMarketing: false,
      };
    }

    return <SettingsContent profile={profile} settings={settings} />;
  } catch (error) {
    console.error("Settings page - Unexpected error:", error);
    // Redirect to login if there's an auth error
    redirect("/login");
  }
}

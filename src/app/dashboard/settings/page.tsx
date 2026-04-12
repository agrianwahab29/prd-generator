import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getUserSettings, getUserProfile } from "@/app/actions/settings";
import { SettingsContent } from "@/components/settings-content";

export default async function SettingsPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  // Server-side data fetch - no client-side waterfall!
  const [profile, settings] = await Promise.all([
    getUserProfile(),
    getUserSettings(),
  ]);

  return <SettingsContent profile={profile} settings={settings} />;
}

import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { DashboardProvider, DashboardShell } from "@/components/dashboard-layout";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  const userName = session.user.name || "User";
  const userEmail = session.user.email || "";

  return (
    <DashboardProvider userName={userName} userEmail={userEmail}>
      <DashboardShell userName={userName} userEmail={userEmail}>
        {children}
      </DashboardShell>
    </DashboardProvider>
  );
}

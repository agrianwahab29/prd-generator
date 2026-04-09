"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/db";
import { projects } from "@/db/schema";
import { eq, and, desc } from "drizzle-orm";
import { revalidatePath, unstable_cache } from "next/cache";

export async function saveProject(data: {
  title: string;
  prompt: string;
  deploymentTarget: string;
  generatedPrd: string;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  const [project] = await db
    .insert(projects)
    .values({
      userId: session.user.id,
      title: data.title,
      prompt: data.prompt,
      deploymentTarget: data.deploymentTarget,
      generatedPrd: data.generatedPrd,
    })
    .returning();

  revalidatePath("/dashboard");

  return { success: true, project };
}

export async function deleteProject(projectId: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  // Ensure user owns this project
  const existing = await db
    .select()
    .from(projects)
    .where(
      and(eq(projects.id, projectId), eq(projects.userId, session.user.id))
    )
    .limit(1);

  if (existing.length === 0) {
    throw new Error("Project not found");
  }

  await db.delete(projects).where(eq(projects.id, projectId));

  revalidatePath("/dashboard");

  return { success: true };
}

// Cached version of getProjects for Server Components
// Cache for 5 minutes, revalidated when saveProject or deleteProject is called
export const getProjectsCached = async (userId: string) => {
  const cached = unstable_cache(
    async (uid: string) => {
      return db
        .select()
        .from(projects)
        .where(eq(projects.userId, uid))
        .orderBy(desc(projects.createdAt));
    },
    ["user-projects"],
    {
      revalidate: 300, // 5 minutes
      tags: [`projects-${userId}`],
    }
  );

  return cached(userId);
};

export async function getProjects() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return [];
  }

  // Use cached version for better performance
  return getProjectsCached(session.user.id);
}

export async function getProject(projectId: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  const project = await db
    .select()
    .from(projects)
    .where(
      and(eq(projects.id, projectId), eq(projects.userId, session.user.id))
    )
    .limit(1);

  if (project.length === 0) {
    return null;
  }

  return project[0];
}

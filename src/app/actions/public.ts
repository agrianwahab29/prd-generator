"use server";

import { db } from "@/db";
import { projects } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function getPublicProject(projectId: string) {
  const project = await db
    .select({
      id: projects.id,
      title: projects.title,
      generatedPrd: projects.generatedPrd,
      deploymentTarget: projects.deploymentTarget,
      createdAt: projects.createdAt,
    })
    .from(projects)
    .where(eq(projects.id, projectId))
    .limit(1);

  if (project.length === 0) {
    return null;
  }

  return project[0];
}

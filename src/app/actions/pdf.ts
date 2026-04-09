"use server";

import { renderToStream, Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import React from "react";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/db";
import { projects } from "@/db/schema";
import { eq, and } from "drizzle-orm";

const styles = StyleSheet.create({
  page: { padding: 40, fontSize: 11, fontFamily: "Helvetica" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20, color: "#4F46E5" },
  section: { marginBottom: 15 },
  heading: { fontSize: 14, fontWeight: "bold", marginBottom: 10, marginTop: 15, color: "#0F172A" },
  subheading: { fontSize: 12, fontWeight: "bold", marginBottom: 8, marginTop: 10, color: "#334155" },
  text: { marginBottom: 8, lineHeight: 1.5, color: "#475569" },
  header: { fontSize: 10, color: "#64748B", marginBottom: 30, borderBottom: "1 solid #E2E8F0", paddingBottom: 10 },
  footer: { fontSize: 9, color: "#94A3B8", marginTop: 30, borderTop: "1 solid #E2E8F0", paddingTop: 10, textAlign: "center" },
});

// Create PDF Document element using React.createElement instead of JSX
function createPDFDocument(title: string, content: string): React.ReactElement {
  // Split content by sections (## headings)
  const sections = content.split(/(?=##\s)/);

  const sectionElements = sections.map((section, idx) => {
    const lines = section.split("\n").filter(Boolean);
    if (lines.length === 0) return null;

    const firstLine = lines[0];
    const isHeading = firstLine.startsWith("##") || firstLine.startsWith("#");

    if (isHeading) {
      const cleanHeading = firstLine.replace(/^#+\s*/, "");
      const contentLines = lines.slice(1).map((line, lineIdx) =>
        React.createElement(Text, { key: lineIdx, style: styles.text }, line.replace(/^\s*[-*]\s*/, "• "))
      );

      return React.createElement(
        View,
        { key: idx, style: styles.section },
        React.createElement(Text, { style: styles.heading }, cleanHeading),
        ...contentLines
      );
    }

    const contentLines = lines.map((line, lineIdx) =>
      React.createElement(Text, { key: lineIdx, style: styles.text }, line)
    );

    return React.createElement(View, { key: idx, style: styles.section }, ...contentLines);
  }).filter(Boolean);

  return React.createElement(
    Document,
    {},
    React.createElement(
      Page,
      { size: "A4", style: styles.page },
      React.createElement(
        View,
        { style: styles.header },
        React.createElement(Text, {}, "AI PRD Generator - Dokumen Spesifikasi Produk")
      ),
      React.createElement(Text, { style: styles.title }, title),
      ...sectionElements,
      React.createElement(
        View,
        { style: styles.footer },
        React.createElement(Text, {}, "Dokumen ini digenerate oleh AI PRD Generator"),
        React.createElement(Text, {}, new Date().toLocaleDateString("id-ID"))
      )
    )
  );
}

export async function generatePDF(projectId: string): Promise<Buffer> {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  const project = await db
    .select()
    .from(projects)
    .where(and(eq(projects.id, projectId), eq(projects.userId, session.user.id)))
    .limit(1);

  if (project.length === 0) {
    throw new Error("Project not found");
  }

  const pdfElement = createPDFDocument(project[0].title, project[0].generatedPrd);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const stream = await renderToStream(pdfElement as any);
  const chunks: Buffer[] = [];

  for await (const chunk of stream) {
    if (typeof chunk === "string") {
      chunks.push(Buffer.from(chunk));
    } else {
      chunks.push(chunk);
    }
  }

  return Buffer.concat(chunks);
}

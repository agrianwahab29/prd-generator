import { test, expect } from "@playwright/test";

test.describe("Generate PRD Page (Authenticated)", () => {
  // Note: In real tests, you'd need to authenticate first or mock the session
  // This is a placeholder for the structure

  test.skip("should display generate form when authenticated", async ({ page }) => {
    // TODO: Implement authentication helper or mock session
    await page.goto("/dashboard/generate");

    // Check form elements
    await expect(page.locator("text=Generate PRD")).toBeVisible();
    await expect(page.locator("textarea")).toBeVisible();
    await expect(page.locator("text=Target Deployment")).toBeVisible();
  });

  test.skip("should show prompt templates", async ({ page }) => {
    await page.goto("/dashboard/generate");

    // Check template cards exist
    await expect(page.locator("text=E-Commerce Platform")).toBeVisible();
    await expect(page.locator("text=Learning Management System")).toBeVisible();
  });

  test.skip("should validate form fields", async ({ page }) => {
    await page.goto("/dashboard/generate");

    // Try to submit empty form
    await page.click('button[type="submit"]');

    // Should show validation errors
    await expect(page.locator("text=minimal 10 karakter")).toBeVisible();
  });
});

test.describe("Dashboard (Authenticated)", () => {
  test.skip("should display projects list when authenticated", async ({ page }) => {
    // TODO: Implement authentication helper
    await page.goto("/dashboard");

    // Check dashboard elements
    await expect(page.locator("text=Proyek Saya")).toBeVisible();
    await expect(page.locator("text=Buat PRD Baru")).toBeVisible();
  });
});

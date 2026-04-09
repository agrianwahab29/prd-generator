import { test, expect } from "@playwright/test";

test.describe("Landing Page", () => {
  test("should display hero section with correct title", async ({ page }) => {
    await page.goto("/");

    // Check page title
    await expect(page).toHaveTitle(/AI PRD Generator/);

    // Check hero heading
    const heading = page.locator("h1");
    await expect(heading).toContainText("Generate PRD");

    // Check CTA buttons exist
    const ctaButton = page.locator("text=Mulai Gratis");
    await expect(ctaButton).toBeVisible();
  });

  test("should navigate to login page", async ({ page }) => {
    await page.goto("/");

    // Click login button
    await page.click("text=Masuk");

    // Should navigate to login
    await expect(page).toHaveURL(/\/login/);

    // Check login form elements
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
  });

  test("should navigate to register page", async ({ page }) => {
    await page.goto("/");

    // Click register button
    await page.click("text=Daftar");

    // Should navigate to register
    await expect(page).toHaveURL(/\/register/);

    // Check register form elements
    await expect(page.locator('input[type="text"]')).toBeVisible();
    await expect(page.locator('input[type="email"]')).toBeVisible();
  });
});

test.describe("Authentication Pages", () => {
  test("login page should have all required elements", async ({ page }) => {
    await page.goto("/login");

    // Page title
    await expect(page.locator("text=Selamat Datang Kembali")).toBeVisible();

    // OAuth buttons
    await expect(page.locator("text=Masuk dengan Google")).toBeVisible();
    await expect(page.locator("text=Masuk dengan GitHub")).toBeVisible();

    // Email/password form
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();

    // Link to register
    const registerLink = page.locator("text=Daftar gratis");
    await expect(registerLink).toBeVisible();
    await expect(registerLink).toHaveAttribute("href", "/register");
  });

  test("register page should have all required elements", async ({ page }) => {
    await page.goto("/register");

    // Page title
    await expect(page.locator("text=Buat Akun Baru")).toBeVisible();

    // OAuth buttons
    await expect(page.locator("text=Daftar dengan Google")).toBeVisible();
    await expect(page.locator("text=Daftar dengan GitHub")).toBeVisible();

    // Registration form fields
    await expect(page.locator('input#name')).toBeVisible();
    await expect(page.locator('input#email')).toBeVisible();
    await expect(page.locator('input#password')).toBeVisible();
    await expect(page.locator('input#confirmPassword')).toBeVisible();

    // Submit button
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });
});

test.describe("Documentation Page", () => {
  test("should display documentation content", async ({ page }) => {
    await page.goto("/docs");

    // Check main heading
    await expect(page.locator("text=Panduan Pengguna AI PRD Generator")).toBeVisible();

    // Check key sections exist
    await expect(page.locator("text=Apa itu PRD?")).toBeVisible();
    await expect(page.locator("text=Cara Menggunakan")).toBeVisible();
    await expect(page.locator("text=Pilihan Deployment")).toBeVisible();
    await expect(page.locator("text=FAQ")).toBeVisible();
  });
});

test.describe("404 Page", () => {
  test("should display custom 404 page", async ({ page }) => {
    await page.goto("/non-existent-page");

    // Check 404 content
    await expect(page.locator("text=Halaman Tidak Ditemukan")).toBeVisible();

    // Check navigation options
    await expect(page.locator("text=Ke Beranda")).toBeVisible();
    await expect(page.locator("text=Kembali")).toBeVisible();
  });
});

import { test, expect } from '@playwright/test';
import { LoginPage }     from '../pages/LoginPage.js';
import { DashboardPage } from '../pages/DashboardPage.js';

test('OrangeHRM Login and Logout Test', async ({ page }) => {

  const loginPage     = new LoginPage(page);
  const dashboardPage = new DashboardPage(page);

  // ── Navigate & Login ────────────────────────────────────────────
  await loginPage.goto();
  await loginPage.login('Admin', 'admin123');

  // ── Verify Dashboard ────────────────────────────────────────────
  await expect(page).toHaveURL(/dashboard/);
  await expect(dashboardPage.dashboardHeading).toBeVisible();
  console.log('✅ Login Successful!');

  await page.waitForTimeout(2000);

  // ── Logout ──────────────────────────────────────────────────────
  await dashboardPage.logout();

  // ── Verify back on Login Page ───────────────────────────────────
  await expect(page).toHaveURL(/login/);
  await expect(loginPage.usernameInput).toBeVisible();
  console.log('✅ Logout Successful!');

  await page.waitForTimeout(5000);
});
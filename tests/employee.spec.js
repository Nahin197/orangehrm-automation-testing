// tests/employee.spec.js
// End-to-end test: Add a new employee → verify login → logout
// Uses Page Object Model — NO locators defined here

import { test, expect }      from '@playwright/test';
import { LoginPage }          from '../pages/LoginPage.js';
import { DashboardPage }      from '../pages/DashboardPage.js';
import { PimPage }            from '../pages/PimPage.js';
import { AddEmployeePage }    from '../pages/AddEmployeePage.js';
import {
  capitalize,
  randomAlpha,
  randomDigits,
  randomUsername,
  generateStrongPassword,
} from '../utils/randomData.js';

test('Add New Employee, Verify New Employee Login, and Logout', async ({ page }) => {
  // Increase timeout to 3 minutes — 10 steps + 1s delays throughout
  test.setTimeout(180_000);

  // ── Generate unique test data ──────────────────────────────────────
  const firstName  = capitalize(randomAlpha(6));  // e.g. "Wkplmn"
  const middleName = capitalize(randomAlpha(5));  // e.g. "Tvxqr"
  const lastName   = capitalize(randomAlpha(6));  // e.g. "Zbnmkp"
  const employeeId = randomDigits(4);             // e.g. "7342"
  const username   = randomUsername();            // e.g. "qwert823"
  const password   = generateStrongPassword();    // e.g. "aB3!xYm7"

  // Log the generated data so you can see it in the test report
  console.log('─────────────────────────────────────────');
  console.log('📋  Generated Test Data');
  console.log(`   First Name  : ${firstName}`);
  console.log(`   Middle Name : ${middleName}`);
  console.log(`   Last Name   : ${lastName}`);
  console.log(`   Employee ID : ${employeeId}`);
  console.log(`   Username    : ${username}`);
  console.log(`   Password    : ${password}`);
  console.log('─────────────────────────────────────────');

  // ── Initialise Page Objects ────────────────────────────────────────
  const loginPage     = new LoginPage(page);
  const dashboardPage = new DashboardPage(page);
  const pimPage       = new PimPage(page);
  const addEmpPage    = new AddEmployeePage(page);

  // ══════════════════════════════════════════════════════════════════
  // STEP 1 ─ Admin Login
  // ══════════════════════════════════════════════════════════════════
  await loginPage.goto();
  await loginPage.login('Admin', 'admin123');

  await expect(page).toHaveURL(/dashboard/);
  await expect(dashboardPage.dashboardHeading).toBeVisible();
  console.log('✅ STEP 1 : Admin login successful');
  await page.waitForTimeout(1000);

  // ══════════════════════════════════════════════════════════════════
  // STEP 2 ─ Navigate to PIM → Employee List
  // ══════════════════════════════════════════════════════════════════
  await dashboardPage.navigateToPIM();
  await expect(page).toHaveURL(/pim\/viewEmployeeList/);
  console.log('✅ STEP 2 : Navigated to PIM → Employee List');
  await page.waitForTimeout(1000);

  // ══════════════════════════════════════════════════════════════════
  // STEP 3 ─ Click "Add" to open the Add Employee form
  // ══════════════════════════════════════════════════════════════════
  await pimPage.clickAddEmployee();
  await expect(page).toHaveURL(/addEmployee/);
  console.log('✅ STEP 3 : Add Employee page opened');
  await page.waitForTimeout(1000);

  // ══════════════════════════════════════════════════════════════════
  // STEP 4 ─ Fill Employee Full Name + Employee ID
  // ══════════════════════════════════════════════════════════════════
  await addEmpPage.fillEmployeeName(firstName, middleName, lastName);
  await addEmpPage.fillEmployeeId(employeeId);
  console.log('✅ STEP 4 : Employee name and ID filled');
  await page.waitForTimeout(1000);

  // ══════════════════════════════════════════════════════════════════
  // STEP 5 ─ Enable "Create Login Details" and fill credentials
  // ══════════════════════════════════════════════════════════════════
  await addEmpPage.enableCreateLoginDetails();
  await addEmpPage.fillLoginDetails(username, password);
  console.log('✅ STEP 5 : Login details filled');
  await page.waitForTimeout(1000);

  // ══════════════════════════════════════════════════════════════════
  // STEP 6 ─ Save the new employee
  // ══════════════════════════════════════════════════════════════════
  await addEmpPage.save();
  await expect(page).toHaveURL(/viewPersonalDetails|pim/);
  console.log('✅ STEP 6 : Employee saved — redirected to Personal Details page');
  await page.waitForTimeout(1000);

  // ══════════════════════════════════════════════════════════════════
  // STEP 7 ─ Admin Logout
  // ══════════════════════════════════════════════════════════════════
  await dashboardPage.logout();
  await expect(page).toHaveURL(/login/);
  await expect(loginPage.usernameInput).toBeVisible();
  console.log('✅ STEP 7 : Admin logged out');
  await page.waitForTimeout(1000);

  // ══════════════════════════════════════════════════════════════════
  // STEP 8 ─ Login as the newly created employee
  // ══════════════════════════════════════════════════════════════════
  await loginPage.login(username, password);
  // New employees may land on profile page or dashboard — accept any authenticated page
  await page.waitForURL(url => !url.href.includes('/auth/'), { timeout: 10000 });
  console.log(`✅ STEP 8 : New employee "${username}" logged in — landed on: ${page.url()}`);
  await page.waitForTimeout(1000);

  // ══════════════════════════════════════════════════════════════════
  // STEP 9 ─ Verify the employee's full name in the top-right dropdown
  //
  //  OrangeHRM displays: <p class="oxd-userdropdown-name">FirstName LastName</p>
  //  We verify it matches the name we entered during employee creation.
  // ══════════════════════════════════════════════════════════════════
  const expectedFullName = `${firstName} ${lastName}`;
  const nameElement      = page.locator('p.oxd-userdropdown-name');

  await expect(nameElement).toBeVisible();
  const displayedName = (await nameElement.textContent()).trim();

  expect(displayedName).toBe(expectedFullName);
  console.log(`✅ STEP 9 : Name verified ✔  Displayed: "${displayedName}"  Expected: "${expectedFullName}"`);
  await page.waitForTimeout(1000);

  // ══════════════════════════════════════════════════════════════════
  // STEP 10 ─ Employee Logout
  // ══════════════════════════════════════════════════════════════════
  await dashboardPage.logout();
  await expect(page).toHaveURL(/login/);
  await expect(loginPage.usernameInput).toBeVisible();
  console.log('✅ STEP 10 : Employee logged out — test complete!');
  await page.waitForTimeout(1000);
});

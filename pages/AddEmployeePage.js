// pages/AddEmployeePage.js
// Page Object Model for the OrangeHRM PIM → Add Employee page
// Selectors verified by live DOM inspection on 2026-08-15
//
// DOM structure after "Create Login Details" toggle is ON (12 inputs total):
//   [0]  Sidebar Search      (type: none, placeholder: "Search")
//   [1]  First Name          (type: none, placeholder: "First Name")
//   [2]  Middle Name         (type: none, placeholder: "Middle Name")
//   [3]  Last Name           (type: none, placeholder: "Last Name")
//   [4]  Employee ID         (type: none, no placeholder)
//   [5]  Profile Photo       (type: file   — hidden)
//   [6]  Toggle checkbox     (type: checkbox — hidden)
//   [7]  Username            (type: none, inside .orangehrm-employee-login-details)
//   [8]  Status Enabled      (type: radio, name="status" — hidden, default = Enabled ✅)
//   [9]  Status Disabled     (type: radio, name="status" — hidden)
//   [10] Password            (type: password)
//   [11] Confirm Password    (type: password)

export class AddEmployeePage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;

    // ── Employee Full Name ─────────────────────────────────────────────
    // Use placeholder text — the most stable selector for these fields
    this.firstNameInput  = page.getByPlaceholder('First Name');
    this.middleNameInput = page.getByPlaceholder('Middle Name');
    this.lastNameInput   = page.getByPlaceholder('Last Name');

    // ── Employee ID ────────────────────────────────────────────────────
    // Located via the label text — avoids fragile nth-indexing
    this.employeeIdInput = page
      .locator('.oxd-input-group', {
        has: page.locator('.oxd-label', { hasText: 'Employee Id' }),
      })
      .locator('input');

    // ── Create Login Details toggle ────────────────────────────────────
    // .oxd-switch-wrapper is the VISIBLE label element wrapping the hidden checkbox
    this.createLoginToggle = page.locator('.oxd-switch-wrapper').first();

    // ── Login Details inputs (visible only after toggle is ON) ──────────
    //
    // Confirmed by Playwright strict-mode error — all 3 fields have autocomplete="off":
    //   username → getByRole('textbox').nth(5)
    //             (textboxes: 0=search, 1=firstName, 2=middleName, 3=lastName,
    //                         4=employeeId, 5=username)
    //   password → input[type="password"] nth(0)
    //   confirm  → input[type="password"] nth(1)
    //
    // ✅ Status radio defaults to "Enabled" — no interaction needed.
    //
    this.usernameLoginInput   = page.getByRole('textbox').nth(5);
    this.passwordInput        = page.locator('input[type="password"]').nth(0);
    this.confirmPasswordInput = page.locator('input[type="password"]').nth(1);

    // ── Save button ────────────────────────────────────────────────────
    this.saveButton = page.getByRole('button', { name: 'Save' });
  }

  // ── Page Methods ───────────────────────────────────────────────────

  /** Fill the Employee Full Name section */
  async fillEmployeeName(firstName, middleName, lastName) {
    await this.firstNameInput.fill(firstName);
    await this.page.waitForTimeout(1000);
    await this.middleNameInput.fill(middleName);
    await this.page.waitForTimeout(1000);
    await this.lastNameInput.fill(lastName);
    await this.page.waitForTimeout(1000);
  }

  /** Clear the auto-generated Employee ID and set a custom one */
  async fillEmployeeId(id) {
    await this.employeeIdInput.clear();
    await this.page.waitForTimeout(1000);
    await this.employeeIdInput.fill(id);
    await this.page.waitForTimeout(1000);
  }

  /** Toggle ON the "Create Login Details" switch and wait for the section to render */
  async enableCreateLoginDetails() {
    await this.createLoginToggle.click();
    // Wait for the password field to appear — confirms the section is fully rendered
    await this.page.locator('input[type="password"]').first().waitFor({ state: 'visible', timeout: 8000 });
    await this.page.waitForTimeout(1000);
  }

  /**
   * Fill username, password and confirm password.
   * Status radio is already "Enabled" by default — no action needed.
   */
  async fillLoginDetails(username, password) {
    await this.usernameLoginInput.fill(username);
    await this.page.waitForTimeout(1000);
    await this.passwordInput.fill(password);
    await this.page.waitForTimeout(1000);
    await this.confirmPasswordInput.fill(password);
    await this.page.waitForTimeout(1000);
  }

  /** Click Save and wait for the redirect to the employee profile page */
  async save() {
    await this.saveButton.click();
    // After save, OrangeHRM redirects to viewPersonalDetails for the new employee
    await this.page.waitForLoadState('networkidle');
    await this.page.waitForTimeout(1000);
  }
}

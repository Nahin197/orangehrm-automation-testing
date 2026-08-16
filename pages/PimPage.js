// pages/PimPage.js
// Page Object Model for the OrangeHRM PIM → Employee List page
// Contains all locators and page methods — NO test logic here

export class PimPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;

    // --- Locators ---
    this.pageHeading = page.getByRole('heading', { name: 'Employee Information' });
    this.addButton   = page.getByRole('button', { name: 'Add' });
  }

  // --- Page Methods ---

  /** Click the Add button to navigate to the Add Employee form */
  async clickAddEmployee() {
    await this.addButton.click();
    await this.page.waitForURL(/addEmployee/);
    await this.page.waitForTimeout(1000);
  }
}

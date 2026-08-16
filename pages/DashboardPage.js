// pages/DashboardPage.js
// Page Object Model for the OrangeHRM Dashboard Page
// Contains all locators and page methods — NO test logic here

export class DashboardPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;

    // --- Locators ---
    this.dashboardHeading = page.getByRole('heading', { name: 'Dashboard' });
    this.userDropdown     = page.locator('.oxd-userdropdown-tab');
    this.logoutMenuItem   = page.getByRole('menuitem', { name: 'Logout' });

    // Sidebar navigation links
    this.pimNavLink = page.locator('a.oxd-main-menu-item').filter({ hasText: 'PIM' });
  }

  // --- Page Methods ---

  /** Click the user avatar to open the dropdown menu */
  async openUserDropdown() {
    await this.userDropdown.click();
    await this.page.waitForTimeout(1000);
  }

  /** Click Logout from the dropdown menu */
  async logout() {
    await this.openUserDropdown();
    await this.logoutMenuItem.click();
    await this.page.waitForTimeout(1000);
  }

  /** Click PIM in the sidebar and wait for the employee list page */
  async navigateToPIM() {
    await this.pimNavLink.click();
    await this.page.waitForURL(/pim\/viewEmployeeList/);
    await this.page.waitForTimeout(1000);
  }
}
